import styles from './styles/Avatar.module.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import AvatarEditor from 'react-avatar-editor';

function Avatar({avatar, setAvatar}) {

  const [image, setImage] = useState(null);
  const [editor, setEditor] = useState(null);
  const [scale, setScale] = useState(1.2);
  const [lastScale, setLastScale] = useState(1.2);
  const [startDistance, setStartDistance] = useState(0);

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      setStartDistance(getDistance(touch1, touch2));
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = getDistance(touch1, touch2);
      const zoom = currentDistance / startDistance;
      const newScale = lastScale * zoom;
      if (newScale >= 1 && newScale <= 3) {
        setScale(newScale);
        setLastScale(newScale); // Обновляем последний масштаб для сглаживания
      }
    }
  };

  const getDistance = (touch1, touch2) => {
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSave = useCallback(() => {
    if (editor) {
      const canvasScaled = editor.getImageScaledToCanvas();
      const croppedImage = canvasScaled.toDataURL();
      // Здесь вы можете отправить croppedImage на сервер или использовать его где-нибудь еще

      setAvatar(croppedImage);

      setImage(null);
      setScale(1.2);
      setLastScale(1.2);
      setStartDistance(0);
    }
  }, [editor]);

  const handleCancel = () => {
    setImage(null);
    setScale(1.2);
    setLastScale(1.2);
    setStartDistance(0);
  }

  const handleClick = () => {
    document.getElementById("change-avatar").click();
  }

  return (
    <div className={styles.avatar}>
      <div onClick={handleClick}>
        <img src={avatar || require("./images/non-avatar.svg").default} alt="" />
      </div>
      {setAvatar &&
        <>
        <div onClick={handleClick}>Изменить</div>
        <input id="change-avatar" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none"}}/>
        {image && (
          <div className={styles.cropAvatarWrapper}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
          >
            <div className={styles.cropAvatar}>
              <AvatarEditor
                ref={setEditor}
                image={image}
                width={200}
                height={300}
                border={(window.innerWidth - 200) / 2}
                color={[0, 0, 0, 0.4]} // RGBA
                scale={scale}
                rotate={0}
              />
              <div className={styles.buttons}>
                <button onClick={handleCancel}>Отмена</button>
                <button onClick={handleSave}>Сохранить</button>
              </div>
            </div>
          </div>
        )}
        </>
      }
    </div>
  );
}

export default Avatar;
