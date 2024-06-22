import styles from './styles/Settings.module.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import FormLIGHT from '../components/FormLIGHT';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import { useMainContext } from '../context';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// Добавляем регулярное выражение для проверки латиницы, нижнего пробела и точки
const usernameRegex = /^[a-zA-Z0-9._]*$/;

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .matches(usernameRegex, 'Имя пользователя может содержать только латиницу, нижние пробелы и точки')
    .max(20, 'Максимальная длина имени пользователя 20 символов')
    .required('Обязательное поле'),
  first_name: Yup.string()
    .max(50, 'Максимальная длина имени 50 символов')
    .required('Обязательное поле'),
  last_name: Yup.string()
    .max(50, 'Максимальная длина фамилии 50 символов')
    .required('Обязательное поле'),
  birthdate: Yup.string()
    .max(10, 'Максимальная длина даты рождения 10 символов в формате ДД-ММ-ГГГГ'),
  phone: Yup.string()
    .max(12, 'Максимальная длина сайта 12 символов')
    .required('Обязательное поле'),
});

function LoadUserInfo() {

  const { account, setAccount, sendMessage, message, setMessage, setLoading, logout, setLoadUserInfo } = useMainContext();

  const [ avatar, setAvatar ] = useState(account?.avatar);
  const [ inputs, setInputs ] = useState({
    "username": {
      value: null,
      isFocused: false,
      error: null,
      label: "Имя пользователя",
      type: "text"
    },
    "first_name": {
      value: null,
      isFocused: false,
      error: null,
      label: "Имя",
      type: "text"
    },
    "last_name": {
      value: null,
      isFocused: false,
      error: null,
      label: "Фамилия",
      type: "text"
    },
    "birthdate": {
      value: null,
      isFocused: false,
      error: null,
      label: "Дата рождения",
      type: "text",
    },
    "phone": {
      value: account?.phone,
      isFocused: account?.phone ? true : false,
      error: null,
      label: "Номер телефона",
      type: "text"
    },
  });

  const handleSubmit = (values) => {
    sendMessage(JSON.stringify(["user", "update", {phone: values.phone, username: values.username, birthdate: values.birthdate, name: [values.first_name, values.last_name].join(" "), avatar: avatar}]));
    setAccount(prevState => ({
      ...prevState,
      ...values
    }));
    setLoading(true);
  }

  return (
    <div className="view">
      <Formik
        initialValues={{ username: account?.username || '',
                         first_name: '',
                         last_name: '',
                         phone: account?.phone || '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
      {({ errors, touched, handleSubmit }) => (
        <Form>
          <div style={{marginTop: 30}}>
            <Avatar avatar={avatar} setAvatar={setAvatar}/>
            <div className={styles.flex20gap}>
              <div className={styles.flex20gap}>
                <FormLIGHT inputs={Object.entries(inputs).slice(0, 1)} setInputs={setInputs} errors={errors} touched={touched} />
                <FormLIGHT inputs={Object.entries(inputs).slice(1, 3)} setInputs={setInputs} errors={errors} touched={touched} />
                <FormLIGHT inputs={Object.entries(inputs).slice(3, 4)} setInputs={setInputs} errors={errors} touched={touched} />
                <FormLIGHT inputs={Object.entries(inputs).slice(4)} setInputs={setInputs} errors={errors} touched={touched} />
              </div>
              <div>
                <Button text="Сохранить" handleClick={handleSubmit} />
              </div>
              <div style={{marginTop: 50}}>
                <Button text="Заполнить позже" handleClick={() => setLoadUserInfo(false)} />
              </div>
            </div>
          </div>
        </Form>
      )}
      </Formik>
    </div>
  );
}

export default LoadUserInfo;
