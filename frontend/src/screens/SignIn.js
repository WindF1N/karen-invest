import React, { useEffect, useState } from 'react';
import styles from './styles/SignIn.module.css';
import { useNavigate } from 'react-router-dom';
import { useMainContext } from '../context';
import FixedButton from '../components/FixedButton';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import MaskedInput from 'react-input-mask';

const validationSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^\+7\s\d{3}\s\d{3}\s\d{2}\s\d{2}$/, 'Введите номер телефона в формате +7 XXX XXX XX XX')
    .required('Обязательное поле'),
});

function SignIn() {
  const navigate = useNavigate();
  const { account, setAccount, login, loading, setLoading } = useMainContext();
  const [isPhoneFilled, setIsPhoneFilled] = useState(false);
  const [phone, setPhone] = useState(null);

  useEffect(() => {
    const handleSubmit = async (values) => {
      if (isPhoneFilled) {
        setAccount(values);
        setLoading(true);
        await login(values, navigate);
      }
    };
    if (isPhoneFilled) {
      handleSubmit({phone})
    }
  }, [isPhoneFilled])

  const handleChange = (event) => {
    const phoneNumber = event.target.value.replace(/\s/g, '');
    const isFilled = phoneNumber.length === 12;
    setIsPhoneFilled(isFilled);
    setPhone(phoneNumber);
    isFilled && console.log(phoneNumber)
  };

  return (
    <div className="view">
      <div className={styles.container}>
        <div style={{ fontSize: 16, fontWeight: 300, marginTop: -150 }}>Welcome to the World of</div>
        <div style={{ marginTop: -20 }}>
          <img src={require("./images/logo.svg").default} alt="" style={{ width: 135 }} />
        </div>
          <div className={styles.input}>
            <div style={{ marginBottom: 10, fontWeight: 300 }}>Введите<br />номер телефона</div>
            <div className={styles.label}>Чтобы войти или стать клиентом</div>
            <MaskedInput
              mask="+7 999 999 99 99"
              placeholder=""
              maskChar={" "}
              onChange={handleChange}
              value={phone}
            />
          </div>
      </div>
      <FixedButton />
    </div>
  );
}

export default SignIn;