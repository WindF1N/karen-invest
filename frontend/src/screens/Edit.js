import styles from './styles/Add.module.css';
import { useFetcher, useNavigate, useParams } from 'react-router-dom';
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
import { useSpringRef, animated, useSpring } from '@react-spring/web';

const validationSchema = Yup.object().shape({
  "title": Yup.string()
    .required("Обязательное поле"),
  "price": Yup.string()
    .required("Обязательное поле")
});

function Edit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { sendMessage, message, setMessage, account } = useMainContext();
  const imagesDivRef = useRef();
  const [ images, setImages ] = useState([]);
  const [ activeImage, setActiveImage ] = useState(0);
  const [ photosError, setPhotosError ] = useState(null);
  const indexOfLoadedImage = useRef(-1);
  const [ cardId, setCardId ] = useState(null);
  const [ card, setCard ] = useState(null);
  const [ isHidden, setIsHidden ] = useState(false);
  const wrapperApi = useSpringRef();
  const wrapperProps = useSpring({
    ref: wrapperApi,
    from: { background: "rgb(24, 24, 26)" },
  })
  const divApi = useSpringRef();
  const divProps = useSpring({
    ref: divApi,
    from: { transform: isHidden ? "translateX(20px)" : "translateX(0px)", background: isHidden ? "#32D058" : "rgba(102, 102, 102, 0.35)" },
  })
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
  const [ saving, setSaving ] = useState(true);
  useEffect(() => {
    window.scrollTo({top: 0});
    sendMessage(JSON.stringify(["cards", "filter", {"_id": id}, 1]))
  }, [])
  const handleSubmit = (values) => {
    if (images.length === 0) {
      setPhotosError("Добавьте хотя бы 1 фотографию");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return
    }
    for (let i = 0; i < card.images?.length; i++) {
      const image = card.images[i];
      if (images.filter((img) => JSON.stringify(img) === JSON.stringify(image)).length === 0) {
        sendMessage(JSON.stringify(["images", "delete", image._id]));
      }
    }
    values["variables"] = variables;
    values["is_hidden"] = isHidden;
    sendMessage(JSON.stringify(["cards", "update", values, account, id]));
    setSaving(true);
  }
  useEffect(() => {
    if (message && window.location.pathname === '/edit/' + id) {
      if (message[0] === "cards") {
        if (message[1] === "updated") {
          setCardId(message[2]);
        } else if (message[1] === 'filter') {
          setCard(message[2][0]);
        } else if (message[1] === 'deleted') {
          navigate("/")
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
  useEffect(() => {
    if (card) {
      console.log(card);
      setVariables(card.variables);
      setImages(card.images);
      setInputs(prevState => {
        return Object.keys(prevState).reduce((acc, key) => {
          const valueFromCard = card[key];
          acc[key] = {
            ...prevState[key],
            value: valueFromCard,
            isFocused: valueFromCard !== ""
          };
          return acc;
        }, {});
      });
      setIsHidden(card.is_hidden || false);
      setSaving(false);
    }
  }, [card])
  const [ variables, setVariables ] = useState([]);
  if (!saving && card) {
    return (
      <div className="view">
        <div className={styles.wrapper} style={{marginBottom: 20}}>
          <Slider images={images}
                  imagesDivRef={imagesDivRef}
                  setActiveImage={setActiveImage}
                  canAdd={true}
                  activeImage={activeImage}
                  setImages={setImages}
                  maxImagesCount={10}
                  photosError={photosError}
                  setPhotosError={setPhotosError}
                  />
          {images.length > 0 &&
            <MiniSlider images={images}
                        imagesDivRef={imagesDivRef}
                        activeImage={activeImage}
                        canAdd={true}
                        setImages={setImages}
                        maxImagesCount={10}
                        />}
        </div>
        <Formik
          initialValues={Object.keys(inputs).reduce((acc, key) => {
            acc[key] = inputs[key].value || ''; // Используем значение или пустую строку по умолчанию
            return acc;
          }, {})}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
        {({ errors, touched, handleSubmit, values }) => (
          <Form>
            <div className={styles.flex20gap}>
              <FormLIGHT inputs={Object.entries(inputs)} setInputs={setInputs} errors={errors} touched={touched} />
              <AddVariable variables={variables} setVariables={setVariables} />
              <Button text="Сохранить" handleClick={handleSubmit} />
              <div style={{display: "flex", alignItems: "center", gap: 10}}>
                <div style={{fontWeight: 300}}>Скрыть карточку</div>
                <animated.div 
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    width: 46,
                    height: 26,
                    borderRadius: 26,
                    background: "rgb(24, 24, 26)",
                    ...wrapperProps
                  }}
                  onClick={() => {
                    setIsHidden(!isHidden);
                    if (!isHidden) {
                      wrapperApi.start({ background: "rgb(24, 24, 26)", config: { duration: 200 } });
                      wrapperApi.set({ background: "rgb(24, 24, 26)" });
                      divApi.start({ transform: "translateX(20px)", background: "#32D058", config: { duration: 200 } });
                      divApi.set({ transform: "translateX(20px)", background: "#32D058" });
                    } else {
                      wrapperApi.start({ background: "rgb(24, 24, 26)", config: { duration: 200 } });
                      wrapperApi.set({ background: "rgb(24, 24, 26)" });
                      divApi.start({ transform: "translateX(0px)", background: "rgba(102, 102, 102, 0.35)", config: { duration: 200 } });
                      divApi.set({ transform: "translateX(0px)", background: "rgba(102, 102, 102, 0.35)" });
                    }
                  }}
                >
                  <animated.div style={{
                    backgroundColor: isHidden ? "#32D058" : "rgba(102, 102, 102, 0.35)",
                    borderRadius: 26,
                    height: 22,
                    margin: 2,
                    transition: ".2s",
                    width: 22,
                    ...divProps
                  }}></animated.div>
                </animated.div>
              </div>
              <div style={{display: "flex", alignItems: "center", justifyContent: "center", color: "#EF0E37", padding: 20, marginTop: 50}} onClick={() => {
                sendMessage(JSON.stringify(["cards", "delete", account, id]));
                setSaving(true);
              }}>
                Удалить карточку
              </div>
            </div>
            <ScrollToError/>
          </Form>
        )}
        </Formik>
        {saving && <LoadingHover />}
      </div>
    );
  }
}

export default Edit;
