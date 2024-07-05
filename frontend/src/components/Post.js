import styles from '../screens/styles/Post.module.css';
import styles2 from '../screens/styles/Main.module.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpringRef, animated, useSpring, config } from '@react-spring/web';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Slider from './Slider';
import MiniSlider from './MiniSlider';
import Button from './Button';
import Contact from './Contact';
import { useMainContext } from '../context';

function Post({ postData, type, parent, basePathUrl }) {
  const navigate = useNavigate();
  const [ data, setData ] = useState(postData);
  const { sendMessage, message, setMessage, cartItems, setCartItems, account, theme } = useMainContext();
  const postDivRef = useRef();
  const [ isOpenPost, setIsOpenPost ] = useState(false);
  const api = useSpringRef();
  const modalApi = useSpringRef();
  const modalApiMain = useSpringRef();
  const modalMainRef = useRef();
  const modalApiCart = useSpringRef();
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
  const modalPropsCart = useSpring({
    ref: modalApiCart,
    from: { bottom: "-12vh" },
  })
  const scrollY = useRef();
  const toggle = () => {
    window.history.replaceState({}, '', '/card/' + data._id);
    if (account?.user?.username === "thecreatxr" || account?.user?.username === "Mr_Romadanov" || account?.user?.user_id === 956105079) {
      sendMessage(JSON.stringify(["cards", "filter", {}, 6, 0]))
    } else {
      sendMessage(JSON.stringify(["cards", "filter", {"is_hidden": false}, 6, 0]))
    }
    api.start({ transform: "scale(1.05)", config: { duration: 200 } });
    setTimeout(() => {
      api.start({ transform: "scale(1)", config: { duration: 200 } });
    }, 200);
    if (!isOpenPost) {
      modalApi.start({ backdropFilter: "blur(0.5vh)", WebkitBackdropFilter: "blur(0.5vh)", background: "rgba(0, 0, 0, .4)", config: { duration: 300 } });
      setTimeout(() => {
        modalApiMain.start({ top: "0vh", config: { duration: 300 } });
      }, 100)
      setTimeout(() => {
        modalApiCart.start({ bottom: "0vh", config: { duration: 300 } });
      }, 300)
      if (!parent) {
        scrollY.current = window.scrollY;
        document.querySelector("html").style.overflow = "hidden";
        document.querySelector("body").style.overflow = "hidden";
        document.querySelector("body").style.position = "fixed";
        document.querySelector("body").style.top = `-${scrollY.current}px`
      }
    }
    setIsOpenPost(!isOpenPost);
  }
  const imagesDivRef = useRef();
  const [ activeImage, setActiveImage ] = useState(null);
  const colors = data.colors || [];
  const [ selectedColor, setSelectedColor ] = useState(null);
  const counts = data.counts || [];
  const [ selectedCount, setSelectedCount ] = useState(null);
  const sizes = data.sizes || [];
  const [ selectedSize, setSelectedSize ] = useState(null);
  const packages = data.packages || [];
  const [ selectedPackage, setSelectedPackage ] = useState(null);
  const [ posts, setPosts ] = useState([]);
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
        if (modalMainRef.current?.getBoundingClientRect().top > window.innerHeight * .15) {
          if (!parent) {
            window.history.replaceState({}, '', basePathUrl);
          } else {
            window.history.replaceState({}, '', '/card/' + parent._id);
          }
          setPosts([]);
          closing.current = true;
          modalApiMain.set({ top: `${e.touches[0].screenY - touchStartY}px`})
          modalApi.start({ backdropFilter: "blur(0vh)", WebkitBackdropFilter: "blur(0vh)", background: "rgba(0, 0, 0, 0)", config: { duration: 300 } });
          setTimeout(() => {
            modalApiMain.start({ top: `${window.innerHeight}px`, config: { duration: 200 } });
          }, 100)
          setTimeout(() => {
            modalApiCart.start({ bottom: "-12vh", config: { duration: 100 } });
          }, 300)
          setTimeout(() => {
            if (!parent) {
              document.querySelector("html").style.overflow = "auto";
              document.querySelector("body").style.overflow = "auto";
              document.querySelector("body").style.position = "relative";
              document.querySelector("body").style.top = "0px";
              window.scrollTo({ top: scrollY.current })
            }
            closing.current = false;
            setIsOpenPost(false);
          }, 600)
        }
      }
    }
  }
  const handleTouchEnd = (e) => {
    if (modalMainRef.current?.getBoundingClientRect().top < window.innerHeight * .15 && !closing.current) {
      modalApiMain.set({ top: `${modalMainRef.current?.getBoundingClientRect().top - window.innerHeight / 10}px` })
      setTimeout(() => {
        modalApiMain.start({ top: `0px`, config: { duration: 200 } });
      }, 100)
    }
  }
  const [ newPrice, setNewPrice ] = useState(null);
  useEffect(() => {
    setData(prevState => ({...prevState, selectedColor: selectedColor, selectedCount: selectedCount, selectedPackage: selectedPackage, selectedSize: selectedSize }))
    for (let i = 0; i < data.prices?.length; i++) {
      const price = data.prices[i];
      let checked = [0, 0, 0, 0]
      if (price.colors.length > 0) {
        if (price.colors.includes(selectedColor)) {
          checked[0] = 1;
        }
      } else {
        checked[0] = 1;
      };
      if (price.counts.length > 0) {
        if (price.counts.includes(selectedCount)) {
          checked[1] = 1;
        }
      } else {
        checked[1] = 1;
      };
      if (price.packages.length > 0) {
        if (price.packages.includes(selectedPackage)) {
          checked[2] = 1;
        }
      } else {
        checked[2] = 1;
      };
      if (price.sizes.length > 0) {
        if (price.sizes.includes(selectedSize)) {
          checked[3] = 1;
        }
      } else {
        checked[3] = 1;
      };
      if (JSON.stringify(checked) === JSON.stringify([1, 1, 1, 1])) {
        setNewPrice(price);
        return
      }
    }
    setNewPrice(null)
  }, [selectedColor, selectedCount, selectedPackage, selectedSize]);
  useEffect(() => {
    if (message && window.location.pathname === '/card/' + data._id) {
      if (message[0] === 'cards') {
        if (message[1] === 'filter') {
          setPosts(prevState => [...prevState, ...message[2].filter(item => {
            const isInMessage = prevState.some(msgItem => msgItem._id === item._id);
            return !isInMessage;
          })]);
        }
      }
      setMessage(null);
    };
  }, [message]);
  const apiRemoveFromCart = useSpringRef();
  const propsRemoveFromCart = useSpring({
    ref: apiRemoveFromCart,
    from: { right: 0, left: 0 },
  })
  const apiAddFromCart = useSpringRef();
  const propsAddFromCart = useSpring({
    ref: apiAddFromCart,
    from: { right: 0, left: 0 },
  })
  const divCountItemsCartRef = useRef();
  const apiCountItemsCart = useSpringRef();
  const propsCountItemsCart = useSpring({
    ref: apiCountItemsCart,
    from: { opacity: 0 },
  })
  const handleCart = (e, type) => {
    e.stopPropagation();
    if (type === 1) {
      setCartItems(prevState => {
        // Ищем индекс элемента в массиве, который мы хотим обновить
        const index = prevState.findIndex(item => JSON.stringify(item.product) === JSON.stringify(data));
        // Если элемент найден, увеличиваем его count на 1
        if (index !== -1) {
          return prevState.map((item, i) => {
            if (i === index && item.count !== 100) {
              return { ...item, count: item.count + 1 };
            }
            return item;
          });
        }
        // Если элемент не найден, добавляем новый элемент в массив с count равным 1
        return [...prevState, { product: data, count: 1 }];
      });
      if (divCountItemsCartRef.current) {
        apiRemoveFromCart.start({right: divCountItemsCartRef.current.clientWidth, config: {duration: 200}});
        apiAddFromCart.start({left: divCountItemsCartRef.current.clientWidth, config: {duration: 200}});
        apiCountItemsCart.start({opacity: 1, config: {duration: 400}});
      }
    } else if (type === 0) {
      setCartItems(prevState => {
        // Ищем индекс элемента в массиве, который мы хотим обновить
        const index = prevState.findIndex(item => JSON.stringify(item.product) === JSON.stringify(data));
        // Если элемент найден, уменьшаем его count на 1
        if (index !== -1) {
          const updatedItem = { ...prevState[index], count: prevState[index].count - 1 };
          if (updatedItem.count === 0) {
            if (divCountItemsCartRef.current) {
              apiRemoveFromCart.start({right: 0, config: {duration: 200}});
              apiAddFromCart.start({left: 0, config: {duration: 200}});
              apiCountItemsCart.start({opacity: 0, config: {duration: 200}});
            }
            // Если количество стало равным 0, удаляем элемент из массива
            return prevState.filter((_, i) => i !== index);
          } else {
            if (divCountItemsCartRef.current) {
              apiRemoveFromCart.start({right: divCountItemsCartRef.current.clientWidth, config: {duration: 200}});
              apiAddFromCart.start({left: divCountItemsCartRef.current.clientWidth, config: {duration: 200}});
              apiCountItemsCart.start({opacity: 1, config: {duration: 400}});
            }
            // Иначе обновляем количество
            return prevState.map((item, i) => i === index ? updatedItem : item);
          }
        }
        if (divCountItemsCartRef.current) {
          apiRemoveFromCart.start({right: divCountItemsCartRef.current.clientWidth, config: {duration: 200}});
          apiAddFromCart.start({left: divCountItemsCartRef.current.clientWidth, config: {duration: 200}});
          apiCountItemsCart.start({opacity: 1, config: {duration: 400}});
        }
        // Если элемент не найден, возвращаем предыдущее состояние
        return prevState;
      });
    };
  }
  useEffect(() => {
    if (divCountItemsCartRef.current) {
      if (cartItems.filter((item) => JSON.stringify(item.product) === JSON.stringify(data)).length > 0) {
        apiRemoveFromCart.start({right: divCountItemsCartRef.current.clientWidth, config: {duration: 200}});
        apiAddFromCart.start({left: divCountItemsCartRef.current.clientWidth, config: {duration: 200}});
        apiCountItemsCart.start({opacity: 1, config: {duration: 400}});
      }
    };
    setData(prevState => ({...prevState, selectedColor: selectedColor, selectedCount: selectedCount, selectedPackage: selectedPackage, selectedSize: selectedSize }))
  }, [divCountItemsCartRef.current])
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const cardId = searchParams.get('card_id');
    if (cardId === data._id) {
      toggle();
    }
  }, [])
  return (
    <>
      {type === "block" &&
        <animated.div style={{width: "calc(50vw - 20px)", position: "relative", height: "100%", zIndex: 1, ...props}}>
          <div ref={postDivRef} onClick={toggle} style={{position: "relative", display: "flex", flexFlow: "column", rowGap: 10, height: "100%"}}>
            <div style={{flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: 9, height: "calc(50vw - 20px)"}}>
              <LazyLoadImage src={data.images[0]?.file} placeholderSrc={data.images[0]?.file_lazy} style={{width: "100%", height: "100%", objectFit: "cover"}} />
            </div>
            {/* <div style={{display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", top: "calc(50vw - 53px)", width: "calc(50vw - 20px)", height: 28}}>
              <animated.div onClick={(e) => handleCart(e, 0)} style={{width: 28, height: 28, zIndex: 1, position: "absolute", left: 0, right: 0, margin: "auto", display: "flex", alignItems: "center", justifyContent: "center", ...propsRemoveFromCart}}>
                <img src={require("../screens/images/remove-to-cart.svg").default} alt="" style={{width: "100%", height: "100%", objectFit: "cover"}} />
              </animated.div>
              <animated.div ref={divCountItemsCartRef} style={{borderRadius: 4, padding: "0 28px", height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "#1C1C1E", zIndex: 0, ...propsCountItemsCart}}>
                <div style={{fontSize: 16, fontWeight: 300, lineHeight: 1}}>{cartItems.filter((item) => JSON.stringify(item.product) === JSON.stringify(data))[0]?.count}</div>
              </animated.div>
              <animated.div onClick={(e) => handleCart(e, 1)} style={{width: 28, height: 28, zIndex: 1, position: "absolute", left: 0, right: 0, margin: "auto", display: "flex", alignItems: "center", justifyContent: "center", ...propsAddFromCart}}>
                <img src={require("../screens/images/add-to-cart.svg").default} alt="" style={{width: "100%", height: "100%", objectFit: "cover"}} />
              </animated.div>
            </div> */}
            <div style={{height: "100%", display: "flex", flexFlow: "column", rowGap: 5, padding: "0 5px 5px 5px"}}>
              <div style={{fontSize: 14, fontWeight: 400}}>{data.title}</div>
              <div style={{fontSize: 14, fontWeight: 300, color: "#8F8E93"}}>{data.price} <span style={{display: "inline-block", textDecoration: "line-through", transform: "scale(.8)"}}>{data.oldPrice}</span></div>
            </div>
          </div>
        </animated.div>}
      {type === "block-small" &&
        <animated.div style={{width: "calc(40vw - 20px)", position: "relative", height: "100%", zIndex: 1, ...props}}>
          <div ref={postDivRef} onClick={toggle} style={{position: "relative", display: "flex", flexFlow: "column", rowGap: 10, height: "100%"}}>
            <div style={{flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: 9}}>
              <LazyLoadImage visibleByDefault={true} src={data.images[0]?.file} placeholderSrc={data.images[0]?.file_lazy} style={{width: "100%", height: "100%", objectFit: "cover"}} />
            </div>
            <div style={{height: "100%", display: "flex", flexFlow: "column", rowGap: 5, padding: "0 5px 5px 5px"}}>
              <div style={{fontSize: 14, fontWeight: 400}}>{data.title}</div>
              <div style={{fontSize: 14, fontWeight: 300, color: "#8F8E93"}}>{data.price}</div>
            </div>
          </div>
        </animated.div>}
      {type === "line" &&
        <div onClick={toggle}>
          <animated.div ref={postDivRef} style={{display: "flex", columnGap: 14, alignItems: "center", position: "relative", opacity: data.is_hidden ? .5 : 1, ...props}}>
            <div style={{minHeight: 80}}>
              <div style={{width: 110, height: 80, flexShrink: 0, overflow: "hidden", borderRadius: 9}}>
                <LazyLoadImage src={data.images[0]?.file} placeholderSrc={data.images[0]?.file_lazy} alt="" style={{width: "100%", height: "100%", objectFit: "cover"}} />
                {data.is_hidden && 
                <div style={{position: "absolute", top: 10, left: 10, background: "#000", borderRadius: 9, padding: 5, fontSize: 10}}>Скрыто</div>}
              </div>
            </div>
            <div style={{display: "flex", flexFlow: "column", rowGap: 5}}>
              <div style={{fontSize: 15, fontWeight: 400}}>{data.price} <span style={{display: "inline-block", textDecoration: "line-through", transform: "scale(.8)"}}>{data.oldPrice}</span></div>
              <div style={{fontSize: 15, fontWeight: 300, color: "#fff"}}>{data.title}</div>
            </div>
            {/* <div style={{marginLeft: "auto", height: 28, width: 86, position: "relative", flexShrink: 0}}>
              <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: 28, flexShrink: 0, width: "100%"}}>
                <animated.div onClick={(e) => handleCart(e, 0)} style={{width: 28, height: 28, zIndex: 1, position: "absolute", left: 0, right: 0, marginLeft: "auto", display: "flex", alignItems: "center", justifyContent: "center", ...propsRemoveFromCart}}>
                  <img src={require("../screens/images/remove-to-cart.svg").default} alt="" style={{width: "100%", height: "100%", objectFit: "cover"}} />
                </animated.div>
                <animated.div ref={divCountItemsCartRef} style={{width: "67.5%", height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "#1C1C1E", zIndex: 0, ...propsCountItemsCart}}>
                  <div style={{fontSize: 16, fontWeight: 300, lineHeight: 1}}>{cartItems.filter((item) => JSON.stringify(item.product) === JSON.stringify(data))[0]?.count}</div>
                </animated.div>
                <animated.div onClick={(e) => handleCart(e, 1)} style={{width: 28, height: 28, zIndex: 1, position: "absolute", left: 0, right: 0, marginLeft: "auto", display: "flex", alignItems: "center", justifyContent: "center", ...propsAddFromCart}}>
                  <img src={require("../screens/images/add-to-cart.svg").default} alt="" style={{width: "100%", height: "100%", objectFit: "cover"}} />
                </animated.div>
              </div>
            </div> */}
          </animated.div>
        </div>}
      {type === "old-normal" &&
        <animated.div onClick={toggle} ref={postDivRef} style={{width: "calc(50vw - 20px)", position: "relative", height: "100%", borderRadius: 9, overflow: "hidden", opacity: data.is_hidden ? .5 : 1, ...props}}>
          <div>
            <div style={{position: "relative", background: "#1C1C1E", display: "flex", flexFlow: "column", rowGap: 10, height: "100%", borderRadius: 9}}>
              <div style={{flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: 9, height: "calc(40vw - 20px)"}}>
                <LazyLoadImage src={data.images[0]?.file} placeholderSrc={data.images[0]?.file_lazy} style={{width: "100%", height: "100%", objectFit: "cover"}} />
                {data.is_hidden && 
                <div style={{position: "absolute", top: 10, left: 10, background: "#000", borderRadius: 9, padding: 5, fontSize: 12}}>Скрыто</div>}
              </div>
              <div style={{width: "calc(100% - 20px)", display: "flex", flexFlow: "column", rowGap: 5, padding: "60px 10px 10px 10px", position: "absolute", bottom: 0, left: 0, background: "linear-gradient(to top, rgba(24, 24, 26, .9) 10%, rgba(24, 24, 26, 0) 100%)"}}>
                <div style={{fontSize: 14, fontWeight: 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: theme === "Dark" ? "#fff" : "#fff"}}>{data.price} <span style={{display: "inline-block", textDecoration: "line-through", transform: "scale(.8)"}}>{data.oldPrice}</span></div>
                <div style={{fontSize: 14, fontWeight: 300, color: "#fff", marginTop: "auto"}}>{data.title}</div>
              </div>
            </div>
          </div>
        </animated.div>}
      {type === "old-big" &&
        <animated.div onClick={toggle} ref={postDivRef} style={{width: "calc(100vw - 30px)", height: "calc(60vw - 30px)", position: "relative", borderRadius: 9, overflow: "hidden", opacity: data.is_hidden ? .5 : 1, ...props}}>
          <div style={{position: "relative", background: "#1C1C1E", display: "flex", flexFlow: "column", rowGap: 10, height: "100%", borderRadius: 9}}>
            <div style={{flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: 9}}>
              <LazyLoadImage src={data.images[0]?.file} placeholderSrc={data.images[0]?.file_lazy} style={{width: "100%", height: "100%", objectFit: "cover"}} />
              {data.is_hidden && 
                <div style={{position: "absolute", top: 10, left: 10, background: "#000", borderRadius: 9, padding: 5, fontSize: 12}}>Скрыто</div>}
            </div>
            <div style={{width: "calc(100% - 20px)", display: "flex", flexFlow: "column", rowGap: 5, padding: "90px 10px 10px 10px", position: "absolute", bottom: 0, left: 0, background: "linear-gradient(to top, rgba(24, 24, 26, .9) 10%, rgba(24, 24, 26, 0) 100%)"}}>
              <div style={{fontSize: 16, fontWeight: 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: theme === "Dark" ? "#fff" : "#fff"}}>{data.price}</div>
              <div style={{fontSize: 16, fontWeight: 300, color: "#fff", marginTop: "auto"}}>{data.title}</div>
            </div>
          </div>
        </animated.div>}
      {type === "old-small" &&
        <animated.div onClick={toggle} ref={postDivRef} style={{width: "calc(40vw - 17px)", height: "calc(33.333vw - 15px)", position: "relative", borderRadius: 9, overflow: "hidden", opacity: data.is_hidden ? .5 : 1, ...props}}>
          <div style={{position: "relative", background: "#1C1C1E", display: "flex", flexFlow: "column", rowGap: 10, height: "100%", borderRadius: 9}}>
            <div style={{flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: 9}}>
              <LazyLoadImage src={data.images[0]?.file} placeholderSrc={data.images[0]?.file_lazy} style={{width: "100%", height: "calc(33.333vw - 15px)", objectFit: "cover"}} />
              {data.is_hidden && 
                <div style={{position: "absolute", top: 10, left: 10, background: "#000", borderRadius: 9, padding: 5, fontSize: 12}}>Скрыто</div>}
            </div>
            <div style={{width: "calc(100% - 20px)", display: "flex", flexFlow: "column", rowGap: 5, padding: "40px 10px 10px 10px", position: "absolute", bottom: 0, left: 0, background: "linear-gradient(to top, rgba(24, 24, 26, .9) 10%, rgba(24, 24, 26, 0) 100%)"}}>
              <div style={{fontSize: 14, fontWeight: 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: theme === "Dark" ? "#fff" : "#fff"}}>{data.price}</div>
              <div style={{fontSize: 14, fontWeight: 300, color: "#fff", marginTop: "auto"}}>{data.title}</div>
            </div>
          </div>
        </animated.div>}
      {isOpenPost &&
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
                                  minHeight: "100vh",
                                  paddingBottom: 300,
                                  borderTopLeftRadius: 25, 
                                  borderTopRightRadius: 25, 
                                  position: "relative",
                                  marginTop: "10vh",
                                  ...modalPropsMain}}
                          ref={modalMainRef}>
              <div
                style={{position: "absolute", top: "-10vh", height: "20vh", width: "100vw", display: "flex", justifyContent: "center", zIndex: 1}}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div style={{marginTop: "auto", marginBottom: "calc(10vh + 20px)", width: "40vw", height: 4, borderRadius: 2, backgroundColor: "#bbb"}}></div>
              </div>
              <Slider images={data.images} imagesDivRef={imagesDivRef} setActiveImage={setActiveImage} />
              {data.images.length > 1 &&
                <div style={{marginTop: "-18vw", position: "relative", zIndex: 3}}>
                  <MiniSlider images={data.images} imagesDivRef={imagesDivRef} activeImage={activeImage} />
                </div>}
              <div className={styles.price} style={{padding: data.images.length > 1 ? "30px 15px 10px 15px" : "10px 15px 10px 15px"}}>
                <div className={styles.title}>{!newPrice ? data.price : newPrice.price} <span style={{display: "inline-block", textDecoration: "line-through", transform: "scale(.8)", color: "#8F8E93"}}>{!newPrice ? data.oldPrice : newPrice.oldPrice}</span></div>
                <div className={styles.actions}>
                  {/* <div className={styles.action} style={{color: "#8F8E93"}}>
                    <img src={require("../screens/images/compare.svg").default} alt="" />
                    Сравнить
                  </div>
                  <div className={styles.action} style={{color: "#8F8E93"}}>
                    <img src={require("../components/images/like.svg").default} alt="" />
                    Избранное
                  </div> */}
                  <div className={styles.action} style={{color: "#8F8E93"}} onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: data.title,
                        url: window.location.href
                      })
                        .then(() => console.log('Successful share'))
                        .catch((error) => console.log('Error sharing', error));
                    } else {
                      // Если Web Share API не поддерживается, вы можете предложить пользователю скопировать ссылку в буфер обмена или использовать другие методы общения.
                      console.log('Web Share API не поддерживается в вашем браузере');
                    }
                  }}>
                    <img src={require("../screens/images/share.svg").default} alt="" />
                    Поделиться
                  </div>
                  {(account?.user?.username === "thecreatxr" || account?.user?.username === "Mr_Romadanov" || account?.user?.user_id === 956105079) &&
                  <div className={styles.action} style={{color: "#8F8E93"}} onClick={() => {
                    window.history.replaceState({}, '', basePathUrl + "?card_id=" + data._id);
                    setPosts([]);
                    document.querySelector("html").style.overflow = "auto";
                    document.querySelector("body").style.overflow = "auto";
                    document.querySelector("body").style.position = "relative";
                    document.querySelector("body").style.top = "0px";
                    setIsOpenPost(false);
                    navigate("/edit/" + data._id);
                  }}>
                    <img src={require("./images/settings.svg").default} alt="" />
                    Настройки
                  </div>}
                </div>
              </div>
              {data.type !== "Не выбрано" ?
              <>
                <div style={{fontSize: 18, fontWeight: 300, padding: "5px 5px 5px 15px"}}>{data.title} </div>
                <div style={{fontSize: 13, fontWeight: 300, color: "rgb(187, 187, 187)", padding: "5px 15px 20px 15px"}}>{data.type} </div>
              </>
              : 
              <>
                <div style={{fontSize: 18, fontWeight: 300, padding: "5px 5px 20px 15px"}}>{data.title} </div>
              </>
              }
              <Contact />
              <div style={{fontSize: 16, fontWeight: 300, padding: "30px 15px 5px 15px"}}>Описание</div>
              <div style={{fontSize: 15, fontWeight: 300, color: "rgb(187, 187, 187)", padding: "10px 15px 20px 15px"}}>
                <span dangerouslySetInnerHTML={{ __html: data.description.replace(/\n/g, "<br/>") }} />
              </div>
              {posts.filter((post) => post._id !== data._id).length > 0 &&
              <>
                <div style={{padding: "10px 15px 15px 15px", fontSize: 16, fontWeight: 300}}>
                  Смотрите также
                </div>
                <div style={{overflowX: "auto", width: "100vw"}} className="no-scrollbar">
                  <div style={{padding: "0 15px", display: "flex", flexWrap: "nowrap", gap: 10}}>
                    {posts.filter((post) => post._id !== data._id).map((post, index) => (
                      <div key={post._id} style={{paddingRight: index === posts.length - 1 ? 15 : 0}}>
                        <Post postData={post} type="old-small" basePathUrl={basePathUrl} parent={
                          {
                            api,
                            modalApi,
                            modalApiMain,
                            modalApiCart,
                            setIsOpenPost,
                            _id: data._id
                          }
                        } />
                      </div>
                    ))}
                  </div>
                </div>
              </>}
            </animated.div>
          </div>
        </animated.div>}
    </>
  )
}

export default Post;
