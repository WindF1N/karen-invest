import { useEffect, useState } from 'react';
import { useSpringRef, animated, useSpring, easings } from '@react-spring/web';
import Title from './Title';
import Button from './Button';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useMainContext } from '../context';

function valuetext(value) {
  return `${value} ₽`;
}

function Filter({ 
  setIsOpenFilter,
  selectedTypes,
  setSelectedTypes,
  defaultPrice,
  setDefaultPrice
 }) {
  const { setHandleClickBackButton } = useMainContext();
  const api = useSpringRef();
  const props = useSpring({
    ref: api,
    from: { top: "0", left: "100vw" },
    to: { top: "0", left: "0vw" }
  })
  useEffect(() => {
    api.start({ top: "0", left: "0vw", config: { duration: 200, tension: 280, friction: 60 } });
    setHandleClickBackButton(() => handleBack);
  }, [])
  const [ price, setPrice ] = useState(defaultPrice.length > 0 ? defaultPrice : [0, 9000])
  const handleChange = (event, value) => {
    setPrice(value);
  };
  const types = [
    "Все",
    "Апартаменты",
    "Новостройки",
    "Дом",
    "Жилое помещение",
    "Здание",
    "Магазин"
  ]
  const handleBack = () => {
    api.start({ top: "0", left: "100vw", config: { duration: 200, tension: 280, friction: 60 } })
    setTimeout(() => {
      document.querySelector("html").style.overflow = "auto";
      document.querySelector("body").style.overflow = "auto";
      document.querySelector("body").style.position = "relative";
      document.querySelector("body").style.top = "0px";
      setHandleClickBackButton(null);
      setIsOpenFilter(false);
    }, 200)
  }
  const handleSave = () => {
    setDefaultPrice(price);
    api.start({ top: "0", left: "100vw", config: { duration: 200, tension: 280, friction: 60 } })
    setTimeout(() => {
      document.querySelector("html").style.overflow = "auto";
      document.querySelector("body").style.overflow = "auto";
      document.querySelector("body").style.position = "relative";
      document.querySelector("body").style.top = "0px";
      setHandleClickBackButton(null);
      setIsOpenFilter(false);
    }, 200)
  }
  const handleClear = () => {
    setSelectedTypes([]);
    setDefaultPrice([0, 9000]);
    setPrice([0, 9000]);
  }
  return (
    <animated.div style={{
      position: "fixed",
      width: "100vw",
      height: "100vh",
      background: "#000",
      zIndex: 3,
      ...props
    }}>
      <div className="view">
        <div style={{borderBottom: "0.5px solid #18181A", marginLeft: -15, width: "100vw"}}>
            <div style={{padding: "0 15px"}}>
                <Title text="Фильтры" canDelete={handleClear} deleteText={"Очистить фильтры"} />
            </div>
        </div>
        <div style={{padding: "20px 0", display: "flex", flexFlow: "column", gap: 10}}>
          <div style={{fontSize: 16, fontWeight: 300}}>Цена</div>
          <div style={{display: "flex", alignItems: "center", gap: 10}}>
            <div>
              <input type="text" 
                     inputMode="decimal" 
                     placeholder="От"
                     value={valuetext(price[0])}
                     readOnly
                     style={{
                      width: 100,
                      background: "#18181A",
                      borderRadius: 4,
                      border: 0,
                      margin: 0,
                      padding: "8px 10px",
                      fontSize: 15,
                      color: "#fff",
                      outline: 0
                     }}
              />
            </div>
            <div>
              <input type="text" 
                      inputMode="decimal" 
                      placeholder="До"
                      value={valuetext(price[1])}
                      readOnly
                      style={{
                        width: 100,
                        background: "#18181A",
                        borderRadius: 4,
                        border: 0,
                        margin: 0,
                        padding: "8px 10px",
                        fontSize: 15,
                        color: "#fff",
                        outline: 0
                      }}
              />
            </div>
          </div>
          <div>
            <Box sx={{ width: "100%" }}>
              <Slider
                value={price}
                onChange={handleChange}
                getAriaValueText={valuetext}
                defaultValue={[1000, 5000]}
                min={0}
                max={10000}
                color="dark"
                sx={{
                  color: '#fff',
                  '& .MuiSlider-track': {
                    border: 'none',
                  },
                  '& .MuiSlider-thumb': {
                    width: 24,
                    height: 24,
                    backgroundColor: '#fff',
                    '&::before': {
                      boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                    },
                    '&:hover, &.Mui-focusVisible, &.Mui-active': {
                      boxShadow: 'none',
                    },
                  },
                }}
              />
            </Box>
          </div>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            paddingBottom: 20
          }}>
            {types.map((type, index) => (
              <div key={"type" + index} 
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px 7px",
                    borderRadius: 4,
                    background: selectedTypes.includes(type) ? "#fff" : "rgb(24, 24, 26)",
                    fontSize: 14,
                    fontWeight: 300,
                    color: selectedTypes.includes(type) ? "#000" : "#fff"
                  }}
                  onClick={() => {
                    if (selectedTypes.includes(type)) {
                      if (selectedTypes.includes("Все")) {
                        setSelectedTypes(prevState => prevState.filter((selectedType) => type !== selectedType && selectedType !== "Все"))
                      } else {
                        setSelectedTypes(prevState => prevState.filter((selectedType) => type !== selectedType))
                      }
                    } else {
                      if (type === "Все") {
                        setSelectedTypes([type])
                      } else {
                        if (selectedTypes.includes("Все")) {
                          setSelectedTypes(prevState => [...prevState.filter((selectedType) => selectedType !== "Все"), type])
                        } else {
                          setSelectedTypes(prevState => [...prevState, type])
                        }
                      }
                    }
                  }}
              >
                {type}
              </div>
            ))}
          </div>
        </div>
        <div>
          <Button text="Применить" handleClick={handleSave} />
        </div>
      </div>
    </animated.div>
  );
}

export default Filter;
