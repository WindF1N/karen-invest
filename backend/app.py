import os
import json
import base64
from bson import ObjectId
from bson.json_util import dumps
from bson.son import SON
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_pymongo import PyMongo
from flask_socketio import SocketIO, emit, disconnect
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, create_refresh_token, get_jwt_identity
from pymongo import DESCENDING
from werkzeug.security import generate_password_hash, check_password_hash
from base64 import b64decode
from PIL import Image, ExifTags
from io import BytesIO
from datetime import datetime, timedelta
import uuid
from dotenv import load_dotenv
import pillow_avif

load_dotenv()

def prepare_data(data):
    if isinstance(data, list):
        return [prepare_data(item) for item in data]
    elif isinstance(data, dict):
        return {k: prepare_data(v) for k, v in data.items()}
    elif isinstance(data, (ObjectId, datetime)):
        return str(data) if isinstance(data, ObjectId) else data.strftime('%Y-%m-%d %H:%M:%S')
    else:
        return data

def reverse_prepare_data(data):
    if isinstance(data, list):
        return [reverse_prepare_data(item) for item in data]
    elif isinstance(data, dict):
        return {k: reverse_prepare_data(v) for k, v in data.items()}
    elif isinstance(data, str):
        try:
            # Пытаемся преобразовать строку в ObjectId
            return ObjectId(data)
        except Exception:
            try:
                # Пытаемся преобразовать строку в datetime
                return datetime.strptime(data, '%Y-%m-%d %H:%M:%S')
            except Exception:
                # Если не удалось преобразовать, возвращаем исходную строку
                return data
    else:
        return data
    
# Функция для преобразования строки цены в число
def convert_price_to_number(price_string):
    # Удаляем все пробелы и символ ₽
    cleaned_price = price_string.replace(' ', '').replace('₽', '')
    # Преобразуем в число
    return int(cleaned_price)

app = Flask(__name__)
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024 * 1024  # 16 megabytes
CORS(app, resources={r"/*": {"origins": "*"}})
mongo = PyMongo(app)
socketio = SocketIO(app, cors_allowed_origins="*", max_http_buffer_size=1024 * 1024 * 1024)
jwt = JWTManager(app)

def compress_image(image_data, max_size, quality):
    image = Image.open(BytesIO(image_data))

    # Проверка EXIF-данных для ориентации
    exif = image.getexif()
    if exif is not None:
        exif = dict(exif.items())
        orientation = exif.get(274)  # 274 - это ключ для ориентации в EXIF-данных
        if orientation == 3:
            image = image.rotate(180, expand=True)
        elif orientation == 6:
            image = image.rotate(270, expand=True)
        elif orientation == 8:
            image = image.rotate(90, expand=True)

    image.thumbnail(max_size, Image.LANCZOS)
    img_byte_arr = BytesIO()
    image.save(img_byte_arr, format='JPEG', quality=quality)
    return img_byte_arr.getvalue()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@socketio.on('connect')
def handle_connect():
    print('A user connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('A user disconnected')

@socketio.on('message')
def handle_message(message):
    message = json.loads(message)
    print(message)

    # mongo.db.users.delete_many({})
    # mongo.db.posts.delete_many({})
    # mongo.db.comments.delete_many({})
    # mongo.db.images.delete_many({})
    # mongo.db.codes.delete_many({})

    if message[0] == "cards":
        if message[1] == "filter":
            sort_order = []
            try:
                # Определяем порядок сортировки в зависимости от message[4]
                if message[4] == 0:
                    sort_order.append(('views_count', -1))  # Популярные - по убыванию views_count
                elif message[4] == 1:
                    sort_order.append(("price_number", 1))  # Дорогие - по возрастанию price_number
                elif message[4] == 2:
                    sort_order.append(("price_number", -1))  # Недорогие - по убыванию price_number
            except:
                pass
            # Добавляем сортировку по умолчанию, если не выбрано иное
            if not sort_order:
                sort_order.append(('_id', 1))  # Сортировка по умолчанию - по возрастанию _id
            min_max_prices_match = None
            try:
                if message[5] and isinstance(message[5], list) and len(message[5]) >= 2:
                    min_max_prices_match = {
                        "price_number": {
                            "$gte": int(message[5][0]),  # Минимальная цена
                            "$lte": int(message[5][1])  # Максимальная цена
                        }
                    }
            except:
                pass
            # Формируем агрегацию
            pipeline = [
                {"$match": reverse_prepare_data(message[2])},  # Фильтрация по message[2]
            ]
            if len(message) > 4:
                if message[4] == 0:
                    # Добавляем рандом
                    pipeline.extend([
                        { "$sample": { "size": message[3] } }
                    ])
            # Добавляем $addFields после первого $match
            pipeline.append({"$addFields": {"price_number": {"$toInt": {"$replaceAll": {"input": {"$replaceAll": {"input": "$price", "find": "₽", "replacement": ""}}, "find": " ", "replacement": ""}}}}})
            # Добавляем фильтрацию по цене, если она определена
            if min_max_prices_match is not None:
                pipeline.append({"$match": min_max_prices_match})
            if len(message) > 4:
                if message[4] != 0:
                    # Добавляем сортировку и ограничение
                    pipeline.extend([
                        {"$sort": SON(sort_order)},
                        {"$limit": message[3]}
                    ])
            else:
                # Добавляем сортировку и ограничение
                pipeline.extend([
                    {"$sort": SON(sort_order)},
                    {"$limit": message[3]}
                ])
            # Выполняем агрегацию
            cards = list(mongo.db.cards.aggregate(pipeline))
            for card in cards:
                images = list(mongo.db.images.find({"card_id": card["_id"]}))
                for image in images:
                    image["_id"] = str(image["_id"])
                card["images"] = images
                card["_id"] = str(card["_id"])
            emit('message', dumps(['cards', 'filter', cards, message[2], message[3]]))
        elif message[1] == "create":
            message[2]["created_at"] = datetime.now()
            new_card_id = mongo.db.cards.insert_one(message[2]).inserted_id
            emit('message', dumps(['cards', 'created', str(new_card_id)]))
        elif message[1] == "update":
            card = mongo.db.cards.find_one(ObjectId(message[4]))
            mongo.db.cards.update_one({"_id": ObjectId(message[4])}, {"$set": message[2]})
            emit('message', dumps(['cards', 'updated', message[4]]))
        elif message[1] == "delete":
            card = mongo.db.cards.find_one(ObjectId(message[3]))
            mongo.db.cards.delete_one({"_id": ObjectId(message[3])})
            mongo.db.images.delete_many({"card_id": ObjectId(message[3])})
            emit('message', dumps(['cards', 'deleted']))
    elif message[0] == "images":
        if message[1] == "add":
            card = mongo.db.cards.find_one({"_id": ObjectId(message[2])})
            if card:
                if "," in message[4]:
                    image_data = b64decode(message[4].split(',')[-1])
                    compressed_image_data = compress_image(image_data, (1200, 1200), 95)
                    compressed_image_data_lazy = compress_image(image_data, (100, 100), 75)
                    # Генерируем случайное название файла
                    filename = str(uuid.uuid4()) + '.jpeg'
                    # Сохраняем сжатое изображение в файл
                    with open(f'static/{filename}', 'wb') as f:
                        f.write(compressed_image_data)
                    with open(f'static/lazy/{filename}', 'wb') as f:
                        f.write(compressed_image_data_lazy)
                    mongo.db.images.insert_one({
                        "created_at": datetime.now(),
                        "card_id": ObjectId(message[2]),
                        "file": f"{os.getenv('SERVER_END_POINT')}/static/{filename}",
                        "file_lazy": f"{os.getenv('SERVER_END_POINT')}/static/lazy/{filename}",
                        "index": message[3]
                    }).inserted_id
                emit("message", dumps(["images", "added", message[3]]))
        elif message[1] == "delete":
            mongo.db.images.delete_one(reverse_prepare_data({"_id": message[2]}))

if __name__ == '__main__':
    socketio.run(app)
