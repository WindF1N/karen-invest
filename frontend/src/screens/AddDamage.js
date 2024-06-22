import './styles/AddDamage.css';
import FixedButton from '../components/FixedButton';
import FormLIGHT from '../components/FormLIGHT';
import Button from '../components/Button';
import MiniSlider from '../components/MiniSlider';
import Title from '../components/Title';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMainContext } from '../context';
import { Formik, Form } from 'formik';

function AddDamage() {
  const navigate = useNavigate();

  const { sendMessage, message, setMessage, damages, setDamages } = useMainContext();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type');

  const [inputs, setInputs] = useState({});

  const [photos, setPhotos] = useState([]);
  const [activePhoto, setActivePhoto] = useState(null);
  const [damageId, setDamageId] = useState(null);
  const [photosError, setPhotosError] = useState(null);

  const [loading, setLoading] = useState(false);

  const [ inputs2, setInputs2 ] = useState({
    "input1": {
      value: null,
      isFocused: false,
      error: null,
      label: "Повреждённая область",
      type: "select",
      choices: [
        "Правое зеркало", 
        "Левое зеркало", 
        "Передняя правая фара", 
        "Передняя левая фара", 
        "Задняя правая фара", 
        "Задняя левая фара", 
        "Лобовое стекло", 
        "Заднее стекло", 
        "Передний бампер", 
        "Задний бампер", 
        "Капот", 
        "Багажник", 
        "Крыша", 
        "Переднее правое крыло", 
        "Переднее левое крыло", 
        "Заднее правое крыло", 
        "Заднее левое крыло", 
        "Передняя правая дверь", 
        "Передняя левая дверь", 
        "Задняя правая дверь", 
        "Задняя левая дверь"
      ]
    },
  })

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFocus = (id) => {
    setInputs((prevState) => {
      if (prevState[id]) {
        return {
          ...prevState,
          [id]: {
            ...prevState[id],
            isFocused: true,
            value: prevState[id].value && prevState[id].value.replace(' мкм', ''),
          },
        };
      } else {
        return {
          ...prevState,
          [id]: {
            ...prevState[id],
            isFocused: true
          },
        };
      };
    });
  };

  const handleBlur = (id) => {
    if ('input2' === id) {
      setInputs((prevState) => {
        if (!prevState[id].value) {
          return {
            ...prevState,
            [id]: {
              ...prevState[id],
              isFocused: false,
            },
          };
        } else {
          return {
            ...prevState,
            [id]: {
              ...prevState[id],
              isFocused: true,
              value: Number(prevState[id].value.replace(/\s/g, '')).toLocaleString() + ' мкм',
            },
          };
        };
      });
    } else {
      setInputs((prevState) => {
        if (!prevState[id].value) {
          return {
            ...prevState,
            [id]: {
              ...prevState[id],
              isFocused: false,
            },
          };
        };
        return prevState;
      });
    };
  };

  const handleChange = (id, event) => {
    if ('input2' === id) {
      const regex = /^[0-9., ]*$/;
      if (regex.test(event.target.value.replace(/\s/g, ''))) {
        setInputs((prevState) => ({
          ...prevState,
          [id]: {
            ...prevState[id],
            value: event.target.value,
            error: prevState[id].error && !prevState[id].value && null
          },
        }));
      };
    } else {
      setInputs((prevState) => {
        if (prevState[id]) {
          if (Array.from(['input3', 'input4', 'input5']).includes(id)) {
            if (event.target.checked) {
              return {
                ...prevState,
                [id]: {
                  ...prevState[id],
                  value: event.target.value,
                  error: null
                }
              };
            } else {
              return {
                ...prevState,
                [id]: {
                  ...prevState[id],
                  value: null,
                  error: null
                }
              };
            };
          };
          return {
            ...prevState,
            [id]: {
              ...prevState[id],
              value: event.target.value,
              error: prevState[id].error && !prevState[id].value && null
            },
          };
        } else {
          return {
            ...prevState,
            [id]: {
              ...prevState[id],
              value: event.target.value,
              error: null
            },
          };
        };
      });
    };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setActivePhoto(null);
    }, 1000);

    return () => clearTimeout(timer);
  }, [activePhoto])

  const handleRemovePhoto = (i) => {
    setActivePhoto(null);
    setPhotos(photos.filter((_, index) => index !== Number(i)));
  };

  return (
    <div className="AddDamage">
      <div className="container">
        <Title text={"Повреждение кузова"} />
        <Formik
          initialValues={{
            "input1": "Правое зеркало",
          }}
          onSubmit={(values) => console.log(JSON.stringify(values))}
        >
          {({ errors, touched, handleSubmit, values }) => (
            <Form>
              <FormLIGHT inputs={Object.entries(inputs2)} setInputs={setInputs2} errors={errors} touched={touched} />
            </Form>
          )}
        </Formik>
        <div className="block-title">Тип повреждения</div>
        <div className="block-inputs">
          <div className="block-input radio">
            <label htmlFor="input1">Трещина</label>
            <input
              id="input1"
              type="radio"
              name="type_damage"
              placeholder=""
              onChange={(event) => {handleChange('input1', event)}}
              value="Трещина"
              checked={!inputs['input1'] ? true : inputs['input1'].value === 'Трещина' ? true : false}
            />
          </div>
          <div className="block-input radio">
            <label htmlFor="input1">Вмятина</label>
            <input
              id="input1"
              type="radio"
              name="type_damage"
              placeholder=""
              onChange={(event) => {handleChange('input1', event)}}
              value="Вмятина"
            />
          </div>
          <div className="block-input radio">
            <label htmlFor="input1">Разбито или отсутствует</label>
            <input
              id="input1"
              type="radio"
              name="type_damage"
              placeholder=""
              onChange={(event) => {handleChange('input1', event)}}
              value="Разбито или отсутствует"
            />
          </div>
          <div className="block-input radio">
            <label htmlFor="input1">Скол/царапина</label>
            <input
              id="input1"
              type="radio"
              name="type_damage"
              placeholder=""
              onChange={(event) => {handleChange('input1', event)}}
              value="Скол/царапина"
            />
          </div>
          <div className="block-input radio">
            <label htmlFor="input1">Коррозия/ржавчина</label>
            <input
              id="input1"
              type="radio"
              name="type_damage"
              placeholder=""
              onChange={(event) => {handleChange('input1', event)}}
              value="Коррозия/ржавчина"
            />
          </div>
          <div className="block-input radio">
            <label htmlFor="input1">Деталь окрашивалась</label>
            <input
              id="input1"
              type="radio"
              name="type_damage"
              placeholder=""
              onChange={(event) => {handleChange('input1', event)}}
              value="Деталь окрашивалась"
            />
          </div>
          <div className="block-input radio">
            <label htmlFor="input1">Деталь менялась</label>
            <input
              id="input1"
              type="radio"
              name="type_damage"
              placeholder=""
              onChange={(event) => {handleChange('input1', event)}}
              value="Деталь менялась"
            />
          </div>
          <div className="block-input">
            <label htmlFor="input2" className={inputs['input2'] && inputs['input2'].isFocused ? 'focused' : ''}>Лакокрасочное покрытие, мкм</label>
            <input
              id="input2"
              type="text"
              placeholder=""
              onFocus={() => handleFocus('input2')}
              onBlur={() => handleBlur('input2')}
              onChange={(event) => handleChange('input2', event)}
              value={inputs['input2']?.value ?? ''}
              className={inputs['input2'] && inputs['input2'].error ? 'error input2' : 'input2'}
            />
            {inputs['input2'] && inputs['input2'].error && (
                <div className="error-label">
                    {inputs['input2'].error}
                </div>
            )}
          </div>
        </div>
        <div className="block-title">
          <div className="flex-line">
            <div>Предполагаемый ремонт</div>
            <div className="error-label">
            {(inputs['input3'] && inputs['input3'].error) || (inputs['input4'] && inputs['input4'].error) || (inputs['input5'] && inputs['input5'].error) ?
              "Выберите хотя бы 1 пункт" : null}
            </div>
          </div>
        </div>
        <div className="block-inputs">
          <div className={(inputs['input3'] && inputs['input3'].error) || (inputs['input4'] && inputs['input4'].error) || (inputs['input5'] && inputs['input5'].error) ? "error block-input radio" : "block-input radio"}>
            <label htmlFor="input3">Окраска</label>
            <input
              id="input3"
              type="checkbox"
              name="repair_damage"
              placeholder=""
              onChange={(event) => {
                handleChange('input3', event);
                let value = event.target.checked ? event.target.value : null;
                sendMessage(JSON.stringify(['cars', 'change-damage', damageId, {'input3': value}]));
              }}
              value="Окраска"
            />
          </div>
          <div className={(inputs['input3'] && inputs['input3'].error) || (inputs['input4'] && inputs['input4'].error) || (inputs['input5'] && inputs['input5'].error) ? "error block-input radio" : "block-input radio"}>
            <label htmlFor="input4">Замена</label>
            <input
              id="input4"
              type="checkbox"
              name="repair_damage"
              placeholder=""
              onChange={(event) => {
                handleChange('input4', event);
                let value = event.target.checked ? event.target.value : null;
                sendMessage(JSON.stringify(['cars', 'change-damage', damageId, {'input4': value}]));
              }}
              value="Замена"
            />
          </div>
          <div className={(inputs['input3'] && inputs['input3'].error) || (inputs['input4'] && inputs['input4'].error) || (inputs['input5'] && inputs['input5'].error) ? "error block-input radio" : "block-input radio"}>
            <label htmlFor="input5">Полировка</label>
            <input
              id="input5"
              type="checkbox"
              name="repair_damage"
              placeholder=""
              onChange={(event) => {
                handleChange('input5', event);
                let value = event.target.checked ? event.target.value : null;
                sendMessage(JSON.stringify(['cars', 'change-damage', damageId, {'input5': value}]));
              }}
              value="Полировка"
            />
          </div>
          <div className={inputs['input6'] && inputs['input6'].error ? "error block-input textarea" : "block-input textarea"}>
            <label htmlFor="input6" className={inputs['input6'] && inputs['input6'].isFocused ? 'focused' : ''}>Описание повреждения</label>
            <textarea
              id="input6"
              onFocus={() => handleFocus('input6')}
              onBlur={() => handleBlur('input6')}
              onChange={(event) => handleChange('input6', event)}
            >
              {inputs['input6']?.value ?? ''}
            </textarea>
            {inputs['input6'] && inputs['input6'].error && (
                <div className="error-label">
                    {inputs['input6'].error}
                </div>
            )}
          </div>
        </div>
        <div className="block-title">Фотографии детали</div>
        <MiniSlider 
            images={photos}
            activeImage={activePhoto}
            setActiveImage={setActivePhoto}
            canAdd={true}
            setImages={setPhotos}
            maxImagesCount={30}
            canDelete={true}
            style={{backgroundColor: "#000", padding: "5px 0 20px 0"}}
        />
        <div className="mini-images-error">{photosError}</div>
        <Button text="Сохранить" style={{marginTop: 10}} />
      </div>
      <FixedButton/>
    </div>
  );
}

export default AddDamage;
