import styles from './styles/Settings.module.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import FixedButton from '../components/FixedButton';
import FormLIGHT from '../components/FormLIGHT';
import Title from '../components/Title';
import Avatar from '../components/Avatar';
import { useMainContext } from '../context';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// Добавляем регулярное выражение для проверки латиницы, нижнего пробела и точки
const usernameRegex = /^[a-zA-Z0-9._]*$/;

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .matches(usernameRegex, 'Никнейм может содержать только латиницу, нижние пробелы и точки')
    .max(20, 'Максимальная длина никнейма 20 символов')
    .required('Обязательное поле'),
  name: Yup.string()
    .max(50, 'Максимальная длина имени 50 символов')
    .required('Обязательное поле'),
  inscription: Yup.string()
    .max(50, 'Максимальная длина деятельности 50 символов'),
  city: Yup.string()
    .max(50, 'Максимальная длина города 50 символов'),
  site: Yup.string()
    .max(50, 'Максимальная длина сайта 50 символов'),
  bio: Yup.string()
    .max(400, 'Максимальная длина описания 400 символов')
});

function Settings() {

  const navigate = useNavigate();
  const { account, setAccount, sendMessage, message, setMessage, setLoading, logout } = useMainContext();

  const [ avatar, setAvatar ] = useState(account?.avatar);
  const [ inputs, setInputs ] = useState({
    "username": {
      value: account?.username,
      isFocused: account?.username ? true : false,
      error: null,
      label: "Никнейм",
      type: "text"
    },
    "name": {
      value: account?.name,
      isFocused: account?.name ? true : false,
      error: null,
      label: "Имя аккаунта",
      type: "text"
    },
    "inscription": {
      value: account?.inscription,
      isFocused: account?.inscription ? true : false,
      error: null,
      label: "Деятельность",
      type: "text"
    },
    "city": {
      value: account?.city,
      isFocused: account?.city ? true : false,
      error: null,
      label: "Город",
      type: "text"
    },
    "site": {
      value: account?.site,
      isFocused: account?.site ? true : false,
      error: null,
      label: "Сайт",
      type: "text"
    },
    "bio": {
      value: account?.bio,
      isFocused: account?.bio ? true : false,
      error: null,
      label: "Описание аккаунта",
      type: "textarea"
    }
  });

  const handleSubmit = (values) => {
    sendMessage(JSON.stringify(["user", "update", {...values, avatar: avatar}]));
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
                         name: account?.name || '',
                         inscription: account?.inscription || '',
                         city: account?.city || '',
                         site: account?.site || '',
                         bio: account?.bio || '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
      {({ errors, touched, handleSubmit }) => (
        <Form>
          <div>
            <div className={styles.header}>
              <div onClick={() => {
                if (window.confirm("Вы действительно хотите выйти из аккаунта?")) {
                  logout(navigate)
                }
              }}>Выйти</div>
              <div onClick={handleSubmit}>Готово</div>
            </div>
            <Avatar avatar={avatar} setAvatar={setAvatar}/>
            <div className={styles.flex20gap}>
              <div className={styles.flex20gap}>
                <FormLIGHT inputs={Object.entries(inputs).slice(0, 5)} setInputs={setInputs} errors={errors} touched={touched} />
                <FormLIGHT inputs={Object.entries(inputs).slice(5)} setInputs={setInputs} errors={errors} touched={touched} />
              </div>
            </div>
          </div>
        </Form>
      )}
      </Formik>
      <FixedButton />
    </div>
  );
}

export default Settings;
