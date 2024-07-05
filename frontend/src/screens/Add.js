import styles from './styles/Add.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useMainContext } from '../context';
import Slider from '../components/Slider';
import MiniSlider from '../components/MiniSlider';
import FormLIGHT from '../components/FormLIGHT';
import Button from '../components/Button';
import LoadingHover from '../components/LoadingHover';
import ScrollToError from '../components/ScrollToError';
import AddVariable from '../components/AddVariable';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

const validationSchema = Yup.object().shape({
  "title": Yup.string()
    .required("Обязательное поле"),
  "price": Yup.string()
    .required("Обязательное поле")
});

function Add() {
  const navigate = useNavigate();
  const { sendMessage, message, setMessage, account } = useMainContext();
  const imagesDivRef = useRef();
  const [ images, setImages ] = useState([]);
  const [ activeImage, setActiveImage ] = useState(0);
  const [ photosError, setPhotosError ] = useState(null);
  const indexOfLoadedImage = useRef(-1);
  const [ cardId, setCardId ] = useState(null);
  const [ inputs, setInputs ] = useState({
    "title": {
      value: null,
      isFocused: false,
      error: null,
      label: "Название",
      type: "text"
    },
    "price": {
      value: null,
      isFocused: false,
      error: null,
      label: "Цена, ₽",
      type: "text",
      mask: createNumberMask({
        prefix: '',
        suffix: ' ₽',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ' ',
        allowDecimal: false,
        decimalSymbol: null,
        decimalLimit: 0, // количество знаков после запятой
        integerLimit: 12, // максимальное количество цифр до запятой
        allowNegative: false,
        allowLeadingZeroes: false,
      })
    },
    "description": {
      value: null,
      isFocused: false,
      error: null,
      label: "Описание",
      type: "textarea",
    },
    "type": {
      value: "Не выбрано",
      error: null,
      label: "Тип недвижимости",
      type: "select",
      choices: [
        "Не выбрано", "Квартиры", "Апартаменты", "Новостройки", "Дом", "Жилое помещение", "Здание", "Магазин", "Земельный участок"
      ]
    },
    "code": {
      value: null,
      isFocused: false,
      error: null,
      label: "Код объекта",
      type: "text",
    },
    "site": {
      value: null,
      isFocused: false,
      error: null,
      label: "Сайт",
      type: "text"
    },
  });
  const [ saving, setSaving ] = useState(false);
  useEffect(() => {
    window.scrollTo({top: 0});
  }, [])
  const handleSubmit = (values) => {
    console.log(values);
    if (images.length === 0) {
      setPhotosError("Добавьте хотя бы 1 фотографию");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return
    }
    values["variables"] = variables;
    values["is_hidden"] = false;
    sendMessage(JSON.stringify(["cards", "create", values, account]));
    setSaving(true);
  }
  useEffect(() => {
    if (message && window.location.pathname === '/add') {
      if (message[0] === "cards") {
        if (message[1] === "created") {
          setCardId(message[2]);
        }
      } else if (message[0] === "images") {
        if (message[1] === "added") {
          indexOfLoadedImage.current = message[2];
        }
      }
      setMessage(null);
    };
  }, [message]);
  useEffect(() => {
    if (cardId && indexOfLoadedImage.current + 1 <= images.length && images[indexOfLoadedImage.current + 1]) {
      sendMessage(JSON.stringify(["images", "add", cardId, indexOfLoadedImage.current + 1, images[indexOfLoadedImage.current + 1].file]));
    } else if (cardId) {
      setSaving(false);
      navigate("/card/" + cardId, { replace: true });
    }
  }, [cardId, indexOfLoadedImage.current])
  const [ variables, setVariables ] = useState([]);
  return (
    <div className="view">
      <div className={styles.wrapper} style={{marginBottom: 20}}>
        <Slider images={images}
                imagesDivRef={imagesDivRef}
                setActiveImage={setActiveImage}
                canAdd={true}
                activeImage={activeImage}
                setImages={setImages}
                maxImagesCount={30}
                photosError={photosError}
                setPhotosError={setPhotosError}
                />
        {images.length > 0 &&
          <MiniSlider images={images}
                      imagesDivRef={imagesDivRef}
                      activeImage={activeImage}
                      canAdd={true}
                      setImages={setImages}
                      maxImagesCount={30}
                      />}
      </div>
      <Formik
        initialValues={{
          "title": "",
          "price": "",
          "description": "",
          "type": "Не выбрано",
          "code": "",
          "site": ""
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
      {({ errors, touched, handleSubmit }) => (
        <Form>
          <div className={styles.flex20gap}>
            <FormLIGHT inputs={Object.entries(inputs)} setInputs={setInputs} errors={errors} touched={touched} />
            <AddVariable variables={variables} setVariables={setVariables} />
            <Button text="Сохранить" handleClick={handleSubmit} />
          </div>
          <ScrollToError/>
        </Form>
      )}
      </Formik>
      {saving && <LoadingHover />}
    </div>
  );
}

export default Add;
