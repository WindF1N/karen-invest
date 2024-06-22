import styles from '../screens/styles/Post.module.css';
import styles2 from '../screens/styles/Main.module.css';
import { useState, useEffect, useRef } from 'react';
import { useSpringRef, animated, useSpring, config } from '@react-spring/web';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useMainContext } from '../context';
import ScrollToError from './ScrollToError';
import { Formik, Form } from 'formik';
import Button from './Button';
import FormLIGHT from './FormLIGHT';

function Contact() {
  const [ isOpen, setIsOpen ] = useState(false);
  const api = useSpringRef();
  const api2 = useSpringRef();
  const modalApi = useSpringRef();
  const modalApiMain = useSpringRef();
  const modalMainRef = useRef();
  const [ type, setType ] = useState(0);
  const props = useSpring({
    ref: api,
    from: { transform: "scale(1)" },
  })
  const props2 = useSpring({
    ref: api2,
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
  const toggle = (t) => {
    setType(t);
    if (t === 0) {
      api.start({ transform: "scale(1.05)", config: { duration: 200 } });
    } else {
      api2.start({ transform: "scale(1.05)", config: { duration: 200 } });
    }
    setTimeout(() => {
      api.start({ transform: "scale(1)", config: { duration: 200 } });
      api2.start({ transform: "scale(1)", config: { duration: 200 } });
    }, 200);
    if (!isOpen) {
      modalApi.start({ backdropFilter: "blur(0.5vh)", WebkitBackdropFilter: "blur(0.5vh)", background: "rgba(0, 0, 0, .4)", config: { duration: 300 } });
      setTimeout(() => {
        modalApiMain.start({ top: "0vh", config: { duration: 300 } });
      }, 100)
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
        if (modalMainRef.current?.getBoundingClientRect().top > window.innerHeight * .75) {
          closing.current = true;
          modalApiMain.set({ top: `${e.touches[0].screenY - touchStartY}px`})
          modalApi.start({ backdropFilter: "blur(0vh)", WebkitBackdropFilter: "blur(0vh)", background: "rgba(0, 0, 0, 0)", config: { duration: 300 } });
          setTimeout(() => {
            modalApiMain.start({ top: `${window.innerHeight}px`, config: { duration: 200 } });
          }, 100)
          setTimeout(() => {
            closing.current = false;
            setIsOpen(false);
          }, 600)
        }
      }
    }
  }
  const handleTouchEnd = (e) => {
    if (modalMainRef.current?.getBoundingClientRect().top < window.innerHeight * .75 && !closing.current) {
      modalApiMain.set({ top: `${modalMainRef.current?.getBoundingClientRect().top - window.innerHeight * .5}px` })
      setTimeout(() => {
        modalApiMain.start({ top: `0px`, config: { duration: 200 } });
      }, 100)
    }
  }
  return (
    <>
        <div style={{padding: "0 15px", display: "flex", gap: 8, width: "100%", boxSizing: "border-box"}}>
          <animated.div style={{width: "100%", ...props}} onClick={() => toggle(0)}>
            <Button text={"Позвонить"} style={{props}} />
          </animated.div>
          <animated.div style={{width: "100%", ...props2}} onClick={() => toggle(1)}>
            <Button text={"Написать"} />
          </animated.div>
        </div>
      {isOpen &&
        <animated.div style={{
                        position: "fixed", 
                        left: 0, 
                        top: 0, 
                        width: "100vw", 
                        height: "100vh",
                        display: "flex",
                        zIndex: 9999,
                        ...modalProps
                      }}>
          <div style={{
            overflowY: "auto",
            overflowX: "hidden",
          }}>
            <animated.div style={{background: "linear-gradient(to top, rgba(0, 0, 0, 1) 50%, rgba(26, 24, 24, 1) 100%)", 
                                  width: "100vw",
                                  minHeight: "30vh",
                                  borderTopLeftRadius: 25, 
                                  borderTopRightRadius: 25, 
                                  position: "relative",
                                  marginTop: "70vh",
                                  ...modalPropsMain}}
                          ref={modalMainRef}>
              <div
                style={{position: "absolute", top: "-70vh", height: "70vh", width: "100vw", display: "flex", justifyContent: "center"}}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div style={{marginTop: "auto", marginBottom: 20, width: "40vw", height: 4, borderRadius: 2, backgroundColor: "#bbb"}}></div>
              </div>
              {type === 1 ?
              <div style={{paddingTop: 10}}>
                <div style={{padding: "20px", fontSize: 16, fontWeight: 300, borderBottom: "0.5px solid rgb(24, 24, 26)"}}>
                  Telegram
                </div>
                <div style={{padding: "20px", fontSize: 16, fontWeight: 300, borderBottom: "0.5px solid rgb(24, 24, 26)"}}>
                  WhatsApp
                </div>
                <div style={{padding: "20px", fontSize: 16, fontWeight: 300}}>
                  Viber
                </div>
              </div> :
              <div style={{paddingTop: 10}}>
                <div style={{padding: "20px", fontSize: 16, fontWeight: 300, borderBottom: "0.5px solid rgb(24, 24, 26)"}}>
                  8 (800) 700-70-70
                </div>
                <div style={{padding: "20px", fontSize: 16, fontWeight: 300, borderBottom: "0.5px solid rgb(24, 24, 26)"}}>
                  +7 966 77 57 966
                </div>
              </div>}
              <div style={{padding: "20px", position: "absolute", bottom: 0, left: 0, width: "100%", boxSizing: "border-box"}}>
                <Button text="Закрыть" small={true} handleClick={(e) => {
                  closing.current = true;
                  modalApi.start({ backdropFilter: "blur(0vh)", WebkitBackdropFilter: "blur(0vh)", background: "rgba(0, 0, 0, 0)", config: { duration: 300 } });
                  setTimeout(() => {
                    modalApiMain.start({ top: `${window.innerHeight}px`, config: { duration: 200 } });
                  }, 100)
                  setTimeout(() => {
                    closing.current = false;
                    setIsOpen(false);
                  }, 600)
                }}/>
              </div>
            </animated.div>
          </div>
        </animated.div>}
    </>
  )
}

export default Contact;
