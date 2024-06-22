import styles from './styles/SearchMore.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import FixedButton from '../components/FixedButton';
import Title from '../components/Title';
import FormLIGHT from '../components/FormLIGHT';
import FlexVariables from '../components/FlexVariables';
import Button from '../components/Button';
import { Formik, Form } from 'formik';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

function SearchMore() {

  const navigate = useNavigate();

  const [ inputs, setInputs ] = useState({
    "input1": {
      value: "1 - Республика Адыгея",
      isFocused: false,
      error: null,
      label: "Регион",
      type: "select",
      choices: [
        "1 - Республика Адыгея",
        "2 - Республика Башкортостан",
        "3 - Республика Бурятия",
        "4 - Республика Алтай",
        "5 - Республика Дагестан",
        "6 - Республика Ингушетия",
        "7 - Кабардино-Балкарская республика",
        "8 - Республика Калмыкия",
        "9 - Карачаево-Черкесская республика",
        "10 -	Республика Карелия",
        "11 -	Республика Коми",
        "12 -	Республика Марий Эл",
        "13 -	Республика Мордовия",
        "14 -	Республика Саха (Якутия)",
        "15 -	Республика Северная Осетия — Алания",
        "16 -	Республика Татарстан",
        "17 -	Республика Тыва",
        "18 -	Удмуртская республика",
        "19 -	Республика Хакасия",
        "20 -	Чеченская республика",
        "21 -	Чувашская республика",
        "22 -	Алтайский край",
        "23 -	Краснодарский край",
        "24 -	Красноярский край",
        "25 -	Приморский край",
        "26 -	Ставропольский край",
        "27 -	Хабаровский край",
        "28 -	Амурская область",
        "29 -	Архангельская область",
        "30 -	Астраханская область",
        "31 -	Белгородская область",
        "32 -	Брянская область",
        "33 -	Владимирская область",
        "34 -	Волгоградская область",
        "35 -	Вологодская область",
        "36 -	Воронежская область",
        "37	- Ивановская область",
        "38	- Иркутская область",
        "39	- Калининградская область",
        "40	- Калужская область",
        "41	- Камчатский край",
        "42	- Кемеровская область",
        "43	- Кировская область",
        "44	- Костромская область",
        "45	- Курганская область",
        "46 -	Курская область",
        "47 -	Ленинградская область",
        "48 -	Липецкая область",
        "49 -	Магаданская область",
        "50 -	Московская область",
        "51 -	Мурманская область",
        "52 -	Нижегородская область",
        "53 -	Новгородская область",
        "54 -	Новосибирская область",
        "55	- Омская область",
        "56	- Оренбургская область",
        "57	- Орловская область",
        "58	- Пензенская область",
        "59	- Пермский край",
        "60	- Псковская область",
        "61	- Ростовская область",
        "62	- Рязанская область",
        "63	- Самарская область",
        "64	- Саратовская область",
        "65	- Сахалинская область",
        "66	- Свердловская область",
        "67	- Смоленская область",
        "68	- Тамбовская область",
        "69	- Тверская область",
        "70	- Томская область",
        "71	- Тульская область",
        "72	- Тюменская область",
        "73	- Ульяновская область",
        "74	- Челябинская область",
        "75	- Забайкальский край",
        "76	- Ярославская область",
        "77	- Москва",
        "78	- Санкт-Петербург",
        "79	- Еврейская автономная область",
        "83	- Ненецкий автономный округ",
        "86	- Ханты-Мансийский автономный округ - Югра",
        "87	- Чукотский автономный округ",
        "89	- Ямало-Ненецкий автономный округ",
        "91	- Республика Крым",
        "92	- Севастополь",
      ]
    },
    "input2": {
      value: "Иномарки",
      isFocused: true,
      error: null,
      label: "Марка",
      type: "text"
    },
    "input3": {
      value: null,
      isFocused: false,
      error: null,
      label: "Модель",
      type: "text"
    },
    "input4": {
      value: null,
      isFocused: false,
      error: null,
      label: "Поколение",
      type: "text"
    },
    "input5": {
      value: "2010 - 2022",
      isFocused: true,
      error: null,
      label: "Год выпуска",
      type: "text"
    },
    "input6": {
      value: "100 000 - 2 000 000",
      isFocused: true,
      error: null,
      label: "Цена, ₽",
      type: "text"
    },
    "input7_": {
      value: "Бензин",
      isFocused: true,
      error: null,
      label: "Двигатель",
      type: "select",
      choices: [
        "Бензин", "Дизель", "Гибрид", "Электро"
      ]
    },
    "input7": {
      value: "2.0 - 2.5 л",
      isFocused: true,
      error: null,
      label: "Объём двигателя, л.",
      type: "text",
      mask: createNumberMask({
        prefix: '',
        suffix: ' л',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: '',
        allowDecimal: true,
        decimalSymbol: ',',
        decimalLimit: 2, // количество знаков после запятой
        integerLimit: 4, // максимальное количество цифр до запятой
        allowNegative: false,
        allowLeadingZeroes: false,
      })
    },
    "input8": {
      value: "270 - 350 л.с.",
      isFocused: true,
      error: null,
      label: "Мощность (л.с.)",
      type: "text"
    },
    "input8_": {
      value: "10 000 - 50 000 км",
      isFocused: true,
      error: null,
      label: "Пробег, км",
      type: "text"
    },
    "input9": {
      value: "Автомат",
      error: null,
      label: "Коробка",
      type: "select",
      choices: [
        "Механика", "Автомат"
      ]
    },
    "input10": {
      value: "Полный",
      error: null,
      label: "Привод",
      type: "select",
      choices: [
        "Передний", "Задний", "Полный", "Гибридный"
      ]
    },
    "input11": {
      value: "Седан",
      error: null,
      label: "Кузов",
      type: "select",
      choices: [
        "Седан", "Универсал", "Хэтчбек", "Лифтбек", "Купе", "Лимузин", "Кабриолет"
      ]
    },
    "input12": {
      value: "Синий",
      isFocused: true,
      error: null,
      label: "Цвет",
      type: "text"
    },
    "input13": {
      value: "Левый",
      error: null,
      label: "Руль",
      type: "select",
      choices: [
        "Левый", "Правый"
      ]
    },
    "input14": {
      value: "1",
      error: null,
      label: "Владельцев по ПТС",
      type: "select",
      choices: [
        "1", "2", "3", "4+"
      ]
    },
    "input15": {
      value: "Оригинал",
      error: null,
      label: "ПТС",
      type: "select",
      choices: [
        "Оригинал", "Электронный", "Дубликат", "Нет ПТС"
      ]
    },
    "input16": {
      value: "Собственник",
      error: null,
      label: "Продавец",
      type: "select",
      choices: [
        "Собственник", "Несобственник"
      ]
    },
    "input17": {
      value: "от 1 до 3 лет",
      isFocused: true,
      error: null,
      label: "Срок владения",
      type: "text"
    },
    "input18": {
      value: "Нет или проблемные",
      error: null,
      label: "Документы",
      type: "select",
      choices: [
        "Нет или проблемные"
      ]
    },
    "input19": {
      value: "Кроме битых",
      error: null,
      label: "Состояние",
      type: "select",
      choices: [
        "Кроме битых", "Новые"
      ]
    },
    "input20": {
      value: "В наличии",
      error: null,
      label: "Статус",
      type: "select",
      choices: [
        "В наличии", "В пути"
      ]
    },
    "input21": {
      value: "Растоможен",
      error: null,
      label: "Таможня Учет Регистрация ГИБДД РФ",
      type: "select",
      choices: [
        "Растоможен", "Нерастоможен"
      ]
    },
    "input22": {
      value: "Непроданные",
      error: null,
      label: "Непроданные",
      type: "radio",
    },
    "input23": {
      value: "Есть отчёт ГИБДД",
      error: null,
      label: "Есть отчёт ГИБДД",
      type: "radio",
    },
    "input24": {
      value: "Без пробега по РФ",
      error: null,
      label: "Без пробега по РФ",
      type: "radio",
    },
    "input25": {
      value: "Обмен возможен",
      error: null,
      label: "Обмен возможен",
      type: "radio",
    },
    "input26": {
      value: "На гарантии",
      error: null,
      label: "На гарантии",
      type: "radio",
    },
    "input27": {
      value: "Онлайн-показ",
      error: null,
      label: "Онлайн-показ",
      type: "radio",
    },
  });
  const [ select, setSelect ] = useState("all");
  const [ variables, setVariables ] = useState([
    {
      value: "all",
      label: "Все"
    },
    {
      value: "new",
      label: "Новые"
    },
    {
      value: "other",
      label: "С пробегом"
    },
  ]);

  useEffect(() => {
    window.scrollTo({top: 0, smooth: "behavior"});
  }, [])

  const handleSubmit = (values) => {
    console.log(JSON.stringify(values))
  }

  return (
    <div className="view">
      <Formik
        initialValues={{
          "input1": "1 - Республика Адыгея",
          "input2": "Иномарки",
          "input5": "2010 - 2022",
          "input6": "100 000 - 2 000 000",
          "input7": "2.0 - 2.5 л",
          "input7_": "Бензин",
          "input8": "270 - 350 л.с.",
          "input8_": "10 000 - 50 000 км",
          "input9": "Автомат",
          "input10": "Полный",
          "input11": "Седан",
          "input12": "Синий",
          "input13": "Левый",
          "input14": "1",
          "input15": "Оригинал",
          "input16": "Собственник",
          "input17": "от 1 до 3 лет",
          "input18": "Нет или проблемные",
          "input19": "Кроме битых",
          "input20": "В наличии",
          "input21": "Растоможен"
        }}
        onSubmit={handleSubmit}
      >
      {({ errors, touched, handleSubmit, values }) => (
        <Form>
          <div className={styles.flex20gap}>
            <Title text="Расширенный поиск" />
            <FlexVariables variables={variables} select={select} setSelect={setSelect} />
            <FormLIGHT inputs={Object.entries(inputs).slice(0, 1)} setInputs={setInputs} errors={errors} touched={touched} />
            <FormLIGHT inputs={Object.entries(inputs).slice(1, 2)} setInputs={setInputs} errors={errors} touched={touched} />
            <FormLIGHT inputs={Object.entries(inputs).slice(2, 4)} setInputs={setInputs} errors={errors} touched={touched} />
            <FormLIGHT inputs={Object.entries(inputs).slice(4, 6)} setInputs={setInputs} errors={errors} touched={touched} />
            <FormLIGHT inputs={Object.entries(inputs).slice(6, 15)} setInputs={setInputs} errors={errors} touched={touched} />
            <FormLIGHT inputs={Object.entries(inputs).slice(15, 23)} setInputs={setInputs} errors={errors} touched={touched} />
            <FormLIGHT inputs={Object.entries(inputs).slice(23)} setInputs={setInputs} errors={errors} touched={touched} />
          </div>
        </Form>
      )}
      </Formik>
      <FixedButton />
    </div>
  );
}

export default SearchMore;
