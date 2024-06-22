import { useState, useEffect } from 'react';
import Title from '../components/Title';
import Button from '../components/Button';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ScrollToError from '../components/ScrollToError';
import { Formik, Form } from 'formik';
import FormLIGHT from '../components/FormLIGHT';
import { useMainContext } from '../context';
import { useNavigate } from 'react-router-dom';

function multiplyPrice(priceString, multiplier) {
    // Удаляем все символы, кроме цифр и пробелов, из строки цены
    const cleanedPriceString = priceString.replace(/[^\d\s]/g, '');
    // Разбиваем очищенную строку на части: количество и валюту
    const amount = cleanedPriceString.replace(' ', '');
    // Умножаем количество на множитель и округляем до целого числа
    const totalAmount = Math.round(parseInt(amount, 10) * multiplier);
    // Форматируем сумму с разделением тысяч и добавляем валюту
    const formattedAmount = totalAmount.toLocaleString('ru-RU');
    // Возвращаем форматированную строку с суммой
    return `${formattedAmount}`;
}

function Cart() {
    const navigate = useNavigate();
    const { cartItems, setCartItems } = useMainContext();
    const [ inputs, setInputs ] = useState({
        "name": {
          value: null,
          isFocused: false,
          error: null,
          label: "Ваше имя",
          type: "text",
        },
        "phone": {
            value: null,
            isFocused: false,
            error: null,
            label: "Ваш телефон",
            type: "text",
            mask: [
                '+', '7', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/
            ]
        },
        "anonymous": {
            value: "Оставаться анонимным для получателя",
            error: null,
            label: "Оставаться анонимным для получателя",
            type: "radio"
        },
        "delivery": {
            value: "Не выбрано",
            error: null,
            label: "Способ доставки",
            type: "select",
            choices: [
                "Курьером", "Самовывоз"
            ]
        },
        "address": {
            value: null,
            isFocused: false,
            error: null,
            label: "Адрес доставки *",
            type: "text",
        },
        "date_of_post": {
            value: null,
            isFocused: false,
            error: null,
            label: "Дата доставки",
            type: "text",
            mask: [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/]
        },
        "time_of_post": {
            value: "Не выбрано",
            error: null,
            label: "Интервал времени доставки",
            type: "select",
            choices: [
                "09:00 - 12:00", "12:00 - 15:00", "15:00 - 18:00", "18:00 - 21:00", "Уточнить у получателя"
            ]
        },
        "receiver_name": {
            value: null,
            isFocused: false,
            error: null,
            label: "Имя получателя",
            type: "text",
        },
        "receiver_phone": {
            value: null,
            isFocused: false,
            error: null,
            label: "Телефон получателя *",
            type: "text",
            mask: [
                '+', '7', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/
            ]
        },
        "sign_the_postcard": {
            value: "Подписать открытку",
            error: null,
            label: "Подписать открытку",
            type: "radio"
        },
        "text_of_postcard": {
            value: null,
            isFocused: false,
            error: null,
            label: "Текст для открытки",
            type: "textarea"
        },
        "with_comment": {
            value: "Добавить комментарий",
            error: null,
            label: "Добавить комментарий",
            type: "radio"
        },
        "comment": {
            value: null,
            isFocused: false,
            error: null,
            label: "Ваш комментарий",
            type: "textarea"
        },
    });
    useEffect(() => {
        window.scrollTo({top: 0, smooth: "behavior"});
    }, [])
    const handleCart = (index, type) => {
        if (type === 1) {
            setCartItems(prevState => {
                return prevState.map((item, i) => {
                    if (i === index && item.count !== 100) {
                        return { ...item, count: item.count + 1 };
                    }
                    return item;
                });
            });
        } else if (type === 0) {
            setCartItems(prevState => {
                const updatedItem = { ...prevState[index], count: prevState[index].count - 1 };
                if (updatedItem.count === 0) {
                    // Если количество стало равным 0, удаляем элемент из массива
                    return prevState.filter((_, i) => i !== index);
                } else {
                    // Иначе обновляем количество
                    return prevState.map((item, i) => i === index ? updatedItem : item);
                }
            });
        }
    }
    const getPrice = (index) => {
        const data = cartItems[index].product
        for (let i = 0; i < data.prices?.length; i++) {
            const price = data.prices[i];
            let checked = [0, 0, 0, 0]
            if (price.colors.length > 0) {
              if (price.colors.includes(data.selectedColor)) {
                checked[0] = 1;
              }
            } else {
              checked[0] = 1;
            };
            if (price.counts.length > 0) {
              if (price.counts.includes(data.selectedCount)) {
                checked[1] = 1;
              }
            } else {
              checked[1] = 1;
            };
            if (price.packages.length > 0) {
              if (price.packages.includes(data.selectedPackage)) {
                checked[2] = 1;
              }
            } else {
              checked[2] = 1;
            };
            if (price.sizes.length > 0) {
              if (price.sizes.includes(data.selectedSize)) {
                checked[3] = 1;
              }
            } else {
              checked[3] = 1;
            };
            if (JSON.stringify(checked) === JSON.stringify([1, 1, 1, 1])) {
              return [price.price, price.oldPrice]
            }
        }
        return [data.price, data.oldPrice]
    }
    const getTotal = () => {
        let [ totalPrice, totalOldPrice ] = [0, 0];
        for (let i = 0; i < cartItems?.length; i++) {
            let [price, oldPrice] = getPrice(i);
            price = parseInt(price.replace(/[^\d\s]/g, '').replace(' ', ''), 10);
            oldPrice = parseInt(oldPrice.replace(/[^\d\s]/g, '').replace(' ', ''), 10);
            totalPrice += price * cartItems[i].count;
            totalOldPrice += oldPrice * cartItems[i].count;
        }
        return [totalPrice.toLocaleString('ru-RU'), totalOldPrice.toLocaleString('ru-RU')]
    }
    const [ total, setTotal ] = useState(getTotal());
    useEffect(() => {
        setTotal(getTotal());
    }, [cartItems])
    if (cartItems.length > 0) {
        return (
            <div className="view">
                <div style={{borderBottom: "0.5px solid #18181A", marginLeft: -15, width: "100vw"}}>
                    <div style={{padding: "0 15px"}}>
                        <Title text="Информация о вашем заказе" />
                    </div>
                </div>
                <div style={{display: "flex", flexFlow: "column", rowGap: 20, marginTop: 20}}>
                    {cartItems.map((item, index) => (
                        <div style={{borderBottom: "0.5px solid #18181A", paddingBottom: 20, position: "relative", display: "flex", columnGap: 14, alignItems: "flex-start"}}>
                            <div style={{width: 80, height: 80, flexShrink: 0}}>
                                <LazyLoadImage src={item.product.images[0].file} placeholderSrc={item.product.images[0].file_lazy} alt="" style={{width: "100%", height: "100%", objectFit: "cover", borderRadius: 9}} />
                            </div>
                            <div style={{position: "relative", width: "calc(100% - 94px)", display: "flex", flexFlow: "column", rowGap: 5, flexShrink: 0}}>
                                <div style={{display: "flex", alignItems: "flex-end", justifyContent: "space-between", width: "100%", flexShrink: 1}}>
                                    <div style={{fontSize: 14, fontWeight: 400, paddingBottom: 10}}>{item.product.title}</div>
                                    <div onClick={() => {
                                        setCartItems(prevState => prevState.filter((_, i) => i !== index));
                                    }} style={{display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", right: -5, top: -5}}>
                                        <img src={require("../components/images/plus.svg").default} className="" alt="close" style={{display: "flex", transform: "rotate(45deg)", filter: "brightness(.7)"}} />
                                    </div>
                                </div>
                                <div style={{display: "flex", justifyContent: "flex-start", alignItems: "center", columnGap: 10, rowGap: 10, width: "100%", flexShrink: 0, flexWrap: "wrap"}}>
                                    <div style={{display: "flex", alignItems: "center", columnGap: 8, width: "auto", flexShrink: 1}} onClick={() => {
                                        document.getElementById(`sort${index}`).focus();
                                        document.getElementById(`arrow${index}`).style.transform = "rotate(270deg)";
                                    }}>
                                        <div style={{fontSize: 15, fontWeight: 300, color: "#bbb"}}>{item.product.selectedCount || "Количество"}</div> <img id={`arrow${index}`} src={require("../components/images/arrow-right.svg").default} alt="arrow right" style={{transition: ".2s", filter: "brightness(.6)", transform: "rotate(90deg)"}}/>
                                        <select id={`sort${index}`} style={{opacity: 0, width: 0, height: 0, margin: 0, padding: 0}} onChange={(e) => {
                                            document.getElementById(`arrow${index}`).style.transform = "rotate(90deg)";
                                            setCartItems(prevState => {
                                                return prevState.map((cartItem, i) => {
                                                    if (i === index) {
                                                        return { ...cartItem, product: {...cartItem.product, selectedCount: e.target.value !== "Не выбрано" ? e.target.value : null} };
                                                    }
                                                    return cartItem;
                                                });
                                            });
                                        }} onBlur={() => {document.getElementById(`arrow${index}`).style.transform = "rotate(90deg)"}}>
                                            <option value={null} selected={item.product.selectedCount === null}>Не выбрано</option>
                                            {item.product.counts.map((count, index) => (
                                                <option value={count} key={index} selected={item.product.selectedCount === count}>{count}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{display: "flex", alignItems: "center", columnGap: 8, width: "auto", flexShrink: 1}} onClick={() => {
                                        document.getElementById(`sort${index}2`).focus();
                                        document.getElementById(`arrow${index}2`).style.transform = "rotate(270deg)";
                                    }}>
                                        <div style={{fontSize: 15, fontWeight: 300, color: "#bbb"}}>{item.product.selectedSize || "Размер"}</div> <img id={`arrow${index}2`} src={require("../components/images/arrow-right.svg").default} alt="arrow right" style={{transition: ".2s", filter: "brightness(.6)", transform: "rotate(90deg)"}}/>
                                        <select id={`sort${index}2`} style={{opacity: 0, width: 0, height: 0, margin: 0, padding: 0}} onChange={(e) => {
                                            document.getElementById(`arrow${index}2`).style.transform = "rotate(90deg)";
                                            setCartItems(prevState => {
                                                return prevState.map((cartItem, i) => {
                                                    if (i === index) {
                                                        return { ...cartItem, product: {...cartItem.product, selectedSize: e.target.value !== "Не выбрано" ? e.target.value : null} };
                                                    }
                                                    return cartItem;
                                                });
                                            });
                                        }} onBlur={() => {document.getElementById(`arrow${index}2`).style.transform = "rotate(90deg)"}}>
                                            <option value={null} selected={item.product.selectedSize === null}>Не выбрано</option>
                                            {item.product.sizes.map((size, index) => (
                                                <option value={size} key={index} selected={item.product.selectedSize === size}>{size}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{display: "flex", alignItems: "center", columnGap: 8, width: "auto", flexShrink: 1}} onClick={() => {
                                        document.getElementById(`sort${index}3`).focus();
                                        document.getElementById(`arrow${index}3`).style.transform = "rotate(270deg)";
                                    }}>
                                        <div style={{fontSize: 15, fontWeight: 300, color: "#bbb"}}>{item.product.selectedColor || "Цвет"}</div> <img id={`arrow${index}3`} src={require("../components/images/arrow-right.svg").default} alt="arrow right" style={{transition: ".2s", filter: "brightness(.6)", transform: "rotate(90deg)"}}/>
                                        <select id={`sort${index}3`} style={{opacity: 0, width: 0, height: 0, margin: 0, padding: 0}} onChange={(e) => {
                                            document.getElementById(`arrow${index}3`).style.transform = "rotate(90deg)";
                                            setCartItems(prevState => {
                                                return prevState.map((cartItem, i) => {
                                                    if (i === index) {
                                                        return { ...cartItem, product: {...cartItem.product, selectedColor: e.target.value !== "Не выбрано" ? e.target.value : null} };
                                                    }
                                                    return cartItem;
                                                });
                                            });
                                        }} onBlur={() => {document.getElementById(`arrow${index}3`).style.transform = "rotate(90deg)"}}>
                                            <option value={null} selected={item.product.selectedColor === null}>Не выбрано</option>
                                            {item.product.colors.map((color, index) => (
                                                <option value={color} key={index} selected={item.product.selectedColor === color}>{color}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{display: "flex", alignItems: "center", columnGap: 8, width: "auto", flexShrink: 1}} onClick={() => {
                                        document.getElementById(`sort${index}4`).focus();
                                        document.getElementById(`arrow${index}4`).style.transform = "rotate(270deg)";
                                    }}>
                                        <div style={{fontSize: 15, fontWeight: 300, color: "#bbb"}}>{item.product.selectedPackage || "Упаковка"}</div> <img id={`arrow${index}4`} src={require("../components/images/arrow-right.svg").default} alt="arrow right" style={{transition: ".2s", filter: "brightness(.6)", transform: "rotate(90deg)"}}/>
                                        <select id={`sort${index}4`} style={{opacity: 0, width: 0, height: 0, margin: 0, padding: 0}} onChange={(e) => {
                                            document.getElementById(`arrow${index}4`).style.transform = "rotate(90deg)";
                                            setCartItems(prevState => {
                                                return prevState.map((cartItem, i) => {
                                                    if (i === index) {
                                                        return { ...cartItem, product: {...cartItem.product, selectedPackage: e.target.value !== "Не выбрано" ? e.target.value : null} };
                                                    }
                                                    return cartItem;
                                                });
                                            });
                                        }} onBlur={() => {document.getElementById(`arrow${index}4`).style.transform = "rotate(90deg)"}}>
                                            <option value={null} selected={item.product.selectedPackage === null}>Не выбрано</option>
                                            {item.product.packages.map((pckage, index) => (
                                                <option value={pckage} key={index} selected={item.product.selectedPackage === pckage}>{pckage}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div style={{display: "flex", justifyContent: "flex-start", width: "100%", flexShrink: 1, marginTop: 5}}>
                                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: 28}}>
                                        <div onClick={() => handleCart(index, 0)} style={{marginRight: -4, width: 28, height: 28, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center"}}>
                                            <img src={require("./images/remove-to-cart.svg").default} alt="" style={{width: "100%", height: "100%", objectFit: "cover"}} />
                                        </div>
                                        <div style={{borderRadius: 4, width: 44, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "#1C1C1E", zIndex: 0}}>
                                            <div style={{fontSize: 16, fontWeight: 300, lineHeight: 1}}>{item.count}</div>
                                        </div>
                                        <div onClick={() => handleCart(index, 1)} style={{marginLeft: -4, width: 28, height: 28, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center"}}>
                                            <img src={require("./images/add-to-cart.svg").default} alt="" style={{width: "100%", height: "100%", objectFit: "cover"}} />
                                        </div>
                                    </div>
                                    <div style={{marginLeft: "auto", display: "flex", flexFlow: "column", alignItems: "flex-end", marginTop: "auto", gap: 5}}>
                                        <div style={{fontSize: 15, fontWeight: 300, color: "#fff"}}>{multiplyPrice(getPrice(index)[0], item.count)} ₽ <span style={{display: "inline-block", textDecoration: "line-through", transform: "scale(.8)", transformOrigin: "right center", color: "#8F8E93"}}>{multiplyPrice(getPrice(index)[1], item.count)} ₽</span></div>
                                        <div style={{fontSize: 14, fontWeight: 300, color: "#8F8E93"}}>{getPrice(index)[0]} / шт</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{display: "flex", justifyContent: "space-between", padding: "10px 0"}}>
                    <div style={{fontSize: 18, fontWeight: 300, color: "#fff"}}>Сумма</div>
                    <div style={{fontSize: 18, fontWeight: 300, color: "#fff"}}><span style={{display: "inline-block", textDecoration: "line-through", transform: "scale(.8)", transformOrigin: "left center", color: "#8F8E93"}}>{total[1]} ₽</span> {total[0]} ₽</div>
                </div>
                <div style={{fontSize: 14, fontWeight: 300, color: "#bbb"}}>
                    Минимальное время сборки и доставки - 2 часа.
                    Пожалуйста, будьте внимательны при оформлении заказа.
                </div>
                <div style={{padding: "20px 0"}}>
                    <Formik
                        initialValues={{
                            "name": "",
                            "phone": "",
                            "anonymous": "",
                            "delivery": "Не выбрано",
                            "address": "",
                            "date_of_post": "",
                            "time_of_post": "Не выбрано",
                            "receiver_name": "",
                            "receiver_phone": "",
                            "sign_the_postcard": "Подписать открытку",
                            "text_of_postcard": "",
                            "with_comment": "Добавить комментарий",
                            "comment": "",
                        }}
                        onSubmit={(values) => alert(JSON.stringify(values))}
                    >
                    {({ errors, touched, handleSubmit, values }) => (
                        <Form>
                            <div style={{display: "flex", gap: 20, flexFlow: "column"}}>
                                <FormLIGHT inputs={Object.entries(inputs).slice(0, 3)} setInputs={setInputs} errors={errors} touched={touched} />
                                <FormLIGHT inputs={Object.entries(inputs).slice(3, 7)} setInputs={setInputs} errors={errors} touched={touched} />
                                <FormLIGHT inputs={Object.entries(inputs).slice(7, 9)} setInputs={setInputs} errors={errors} touched={touched} />
                                <FormLIGHT inputs={Object.entries(inputs).slice(9, 11)} setInputs={setInputs} errors={errors} touched={touched} />
                                <FormLIGHT inputs={Object.entries(inputs).slice(11, 13)} setInputs={setInputs} errors={errors} touched={touched} />
                                <div style={{display: "flex", flexFlow: "column", gap: 10}}>
                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                        <div style={{fontSize: 16, fontWeight: 300, color: "#bbb"}}>Сумма</div>
                                        <div style={{fontSize: 16, fontWeight: 300, color: "#bbb"}}>{total[0]} ₽</div>
                                    </div>
                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                        <div style={{fontSize: 18, fontWeight: 300, color: "#fff"}}>Итоговая сумма</div>
                                        <div style={{fontSize: 18, fontWeight: 300, color: "#fff"}}>{total[0]} ₽</div>
                                    </div>     
                                </div>
                                <Button text="Оплатить" />
                            </div>
                            <ScrollToError/>
                        </Form>
                    )}
                    </Formik>  
                </div>
            </div>
        );
    } else {
        return (
            <div style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexFlow: "column",
                gap: 20
            }}>
                <div style={{fontSize: 18, fontWeight: 300, color: "#bbb"}}>Ваша корзина пустая</div>
                <div>
                    <Button text={"Выбрать букет"} small={true} handleClick={() => navigate("/search", {replace: true})} />
                </div>
            </div>
        )
    }
    
}

export default Cart;
