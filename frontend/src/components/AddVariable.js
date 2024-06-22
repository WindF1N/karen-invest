import { useState, useEffect, useRef } from 'react';
import { useSpringRef, animated, useSpring, config } from '@react-spring/web';
import ScrollToError from './ScrollToError';
import { Formik, Form } from 'formik';
import Button from './Button';
import EditPrice from './EditPrice';
import FormLIGHT from './FormLIGHT';
import * as Yup from 'yup';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

const validationSchema = Yup.object().shape({
  "title": Yup.string()
    .max(30, 'Макс. длина 30')
    .required("Обязательное поле"),
});

function AddVariable({ variables, setVariables }) {
  const [ inputs, setInputs ] = useState({
    "title": {
      value: null,
      isFocused: false,
      error: null,
      label: "Название",
      type: "text",
    }
  });
  const [ isOpen, setIsOpen ] = useState(false);
  const api = useSpringRef();
  const modalApi = useSpringRef();
  const modalApiMain = useSpringRef();
  const modalMainRef = useRef();
  const props = useSpring({
    ref: api,
    from: { transform: "scale(1)" },
  })
  const modalProps = useSpring({
    ref: modalApi,
    from: { backdropFilter: "blur(0vh)", WebkitBackdropFilter: "blur(0vh)", background: "rgba(0, 0, 0, 0)" },
  })
  const modalPropsMain = useSpring({
    ref: modalApiMain,
    from: { top: "100vh" },
  })
  const scrollY = useRef();
  const toggle = () => {
    api.start({ transform: "scale(1.05)", config: { duration: 200 } });
    setTimeout(() => {
      api.start({ transform: "scale(1)", config: { duration: 200 } });
    }, 200);
    if (!isOpen) {
      modalApi.start({ backdropFilter: "blur(0.5vh)", WebkitBackdropFilter: "blur(0.5vh)", background: "rgba(0, 0, 0, .4)", config: { duration: 300 } });
      setTimeout(() => {
        modalApiMain.start({ top: "0vh", config: { duration: 300 } });
      }, 100)
      scrollY.current = window.scrollY;
      document.querySelector("html").style.overflow = "hidden";
      document.querySelector("body").style.overflow = "hidden";
      document.querySelector("body").style.position = "fixed";
      document.querySelector("body").style.top = `-${scrollY.current}px`
    }
    setIsOpen(!isOpen);
  }
  const [ touchStartY, setTouchStartY ] = useState(null);
  const [ modalMainTopOffset, setModalMainTopOffset ] = useState(null);
  const closing = useRef(false);
  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].screenY);
    if (modalMainRef.current) {
      setModalMainTopOffset(modalMainRef.current.getBoundingClientRect().top)
    }
  }
  const handleTouchMove = (e) => {
    if (modalMainRef.current && !closing.current) {
      if (touchStartY < e.touches[0].screenY) {
        modalMainRef.current.style.top = `${e.touches[0].screenY - touchStartY}px`;
        if (modalMainRef.current?.getBoundingClientRect().top > window.innerHeight * .7) {
          closing.current = true;
          modalApiMain.set({ top: `${e.touches[0].screenY - touchStartY}px`})
          modalApi.start({ backdropFilter: "blur(0vh)", WebkitBackdropFilter: "blur(0vh)", background: "rgba(0, 0, 0, 0)", config: { duration: 300 } });
          setTimeout(() => {
            modalApiMain.start({ top: `${window.innerHeight}px`, config: { duration: 200 } });
          }, 100)
          setTimeout(() => {
            document.querySelector("html").style.overflow = "auto";
            document.querySelector("body").style.overflow = "auto";
            document.querySelector("body").style.position = "relative";
            document.querySelector("body").style.top = "0px";
            window.scrollTo({ top: scrollY.current })
            closing.current = false;
            setIsOpen(false);
          }, 600)
        }
      }
    }
  }
  const handleTouchEnd = (e) => {
    if (modalMainRef.current?.getBoundingClientRect().top < window.innerHeight * .7 && !closing.current) {
      modalApiMain.set({ top: `${modalMainRef.current?.getBoundingClientRect().top - window.innerHeight * .2}px` })
      setTimeout(() => {
        modalApiMain.start({ top: `0px`, config: { duration: 200 } });
      }, 100)
    }
  }
  const handleSubmit = (values) => {
    setVariables(prevState => [...prevState, values]);
    closing.current = true;
    modalApi.start({ backdropFilter: "blur(0vh)", WebkitBackdropFilter: "blur(0vh)", background: "rgba(0, 0, 0, 0)", config: { duration: 300 } });
    setTimeout(() => {
      modalApiMain.start({ top: `${window.innerHeight}px`, config: { duration: 200 } });
    }, 100)
    setTimeout(() => {
      document.querySelector("html").style.overflow = "auto";
      document.querySelector("body").style.overflow = "auto";
      document.querySelector("body").style.position = "relative";
      document.querySelector("body").style.top = "0px";
      window.scrollTo({ top: scrollY.current })
      closing.current = false;
      setIsOpen(false);
    }, 600)
  }
  return (
    <>
      <div style={{borderRadius: "4px", overflow: "hidden"}} onClick={() => {
        // Получаем все элементы с классом 'variable'
        const elements = document.querySelectorAll('.variable');
        
        // Применяем transform: translateX(0px) ко всем элементам
        elements.forEach(element => {
          element.style.transform = 'translateX(0px)';
        });
      }}>
      {variables.map((variable, index) => (
        <div className="variable" style={{display: "flex", flexShrink: 0, transition: ".3s", height: 47, borderBottom: ".5px solid #292929"}} key={variable + index}>
          <div style={{display: "flex", alignItems: "center", gap: 10, marginTop: 0, background: "#18181A", padding: "0 10px", width: "100%", flexShrink: 0, boxSizing: "border-box"}}>
            <div style={{height: 27, display: "flex", alignItems: "center", justifyContent: "center"}} onClick={(e) => {
              e.stopPropagation();
              e.currentTarget.parentElement.parentElement.style.transition = '0.3s';
              e.currentTarget.parentElement.parentElement.style.transform = 'translateX(-85px)';
            }}>
              <img src={require("../screens/images/minus-ios.svg").default} className="" alt="" style={{height: "20px"}} />
            </div>
            <div style={{
                fontWeight: 300,
                fontSize: 15,
                height: "100%",
                display: "flex",
                alignItems: "center",
                position: "relative",
                paddingRight: 10
            }}>
              {variable.title}
              <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                width: "1px",
                background: "linear-gradient(to bottom, transparent, #292929)",
                zIndex: 10
              }} />
            </div>
            <div style={{width: "100%", boxSizing: "border-box"}}>
              <input type="text" value={variable.value || ""} name={variable + index} 
                                                              style={{
                                                                 width: "100%", 
                                                                 display: "flex",
                                                                 padding: 0,
                                                                 margin: 0,
                                                                 border: 0,
                                                                 background: "inherit",
                                                                 outline: 0,
                                                                 color: "#fff",
                                                                 fontSize: 15,
                                                                 fontFamily: '"Roboto", sans-serif'
                                                              }}
                                                              onChange={(e) => {
                                                                // Создайте новый массив с обновленными значениями
                                                                const newVariables = variables.map((item, i) => {
                                                                  if (i === index) {
                                                                    // Обновите только измененную переменную
                                                                    return {...item, value: e.target.value};
                                                                  }
                                                                  return item;
                                                                });
                                                                setVariables(newVariables); // Обновите состояние с новым массивом
                                                              }} 
                                                              maxLength={200}/>
            </div>
          </div>
          <div style={{background: "#ff453b", display: "flex", alignItems: "center", justifyContent: "flex-start", fontSize: 14, width: "100%", flexShrink: 0, paddingLeft: 13}} onClick={(e) => {
              e.stopPropagation();
              e.currentTarget.parentElement.style.transform = 'translateX(-'+ (e.currentTarget.parentElement.offsetWidth + 10) +'px) scaleY(0)';
              setTimeout(() => {
                setVariables(prevState => prevState.filter((_, i) => i !== index));
                // Получаем все элементы с классом 'variable'
                const elements = document.querySelectorAll('.variable');
                
                // Применяем transform: translateX(0px) ко всем элементам
                elements.forEach(element => {
                  element.style.transition = '0s';
                  element.style.transform = 'translateX(0px)';
                });
              }, 300)
          }}>
            Удалить
          </div>
        </div>
      ))}

        <animated.div style={{display: "flex", alignItems: "center", gap: 10, marginTop: 0, background: "#18181A", padding: "10px", ...props}} onClick={toggle}>
            <div style={{height: 27, display: "flex", alignItems: "center", justifyContent: "center"}}>
                <img src={require("../screens/images/plus-ios.svg").default} className="" alt="" style={{height: "20px"}} />
            </div>
            <div style={{
                fontWeight: 300,
                fontSize: 15
            }}>
                добавить поле
            </div>
        </animated.div>
      </div>
      {isOpen &&
        <animated.div style={{
                        position: "fixed", 
                        left: 0, 
                        top: 0, 
                        width: "100vw", 
                        height: "100vh",
                        zIndex: 99999,
                        display: "flex",
                        ...modalProps
                      }}>
          <div style={{
            overflowY: "auto",
            overflowX: "hidden",
          }}>
            <animated.div style={{background: "linear-gradient(to top, rgba(0, 0, 0, 1) 50%, rgba(26, 24, 24, 1) 100%)", 
                                  width: "100vw",
                                  minHeight: "50vh",
                                  borderTopLeftRadius: 25, 
                                  borderTopRightRadius: 25, 
                                  position: "relative",
                                  marginTop: "50vh",
                                  ...modalPropsMain}}
                          ref={modalMainRef}>
              <div
                style={{position: "absolute", top: "-50vh", height: "50vh", width: "100vw", display: "flex", justifyContent: "center"}}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div style={{marginTop: "auto", marginBottom: 20, width: "40vw", height: 4, borderRadius: 2, backgroundColor: "#bbb"}}></div>
              </div>
              <div style={{padding: "30px 20px 15px 20px", fontSize: 16, fontWeight: 300}}>
                Добавьте поле
              </div>
              <div style={{padding: "0px 20px 20px 20px"}}>
                <Formik
                    initialValues={{
                        "title": ""
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                {({ errors, touched, handleSubmit }) => (
                    <Form>
                      <div style={{display: "flex", gap: 20, flexFlow: "column"}}>
                        <FormLIGHT inputs={Object.entries(inputs).slice(0, 3)} setInputs={setInputs} errors={errors} touched={touched} />
                        <Button text="Добавить" handleClick={handleSubmit} />
                      </div>
                      <ScrollToError/>
                    </Form>
                )}
                </Formik>  
              </div>
            </animated.div>
          </div>
        </animated.div>}
    </>
  )
}

export default AddVariable;
