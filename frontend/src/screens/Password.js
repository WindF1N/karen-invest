import styles from './styles/Add.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import FixedButton from '../components/FixedButton';
import Title from '../components/Title';
import FormLIGHT from '../components/FormLIGHT';
import Button from '../components/Button';
import { Formik, Form } from 'formik';
import Items from '../components/Items';

function Password() {

  const navigate = useNavigate();

  const [ more, setMore ] = useState(false);
  const [ inputs, setInputs ] = useState({
    "input1": {
      value: null,
      isFocused: false,
      error: null,
      label: "Добавить заметку",
      type: "textarea"
    },
  })

  return (
    <div className={styles.view} style={{padding: "0 10px"}}>
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 5px", marginBottom: -10}}>
        <Title text="Пароли"/>
        <div style={{display: "flex", alignItems: "center", gap: 10}}>
          <div style={{fontSize: 16, fontWeight: 400 }}>
            Править
          </div>
        </div>
      </div>
      <div style={{marginTop: 20}}>
        <Items items={[
          {
            label: "Веб-сайт",
            value: "avito.ru"
          },
          {
            label: "Имя пользователя",
            value: "ProlbGya.ru"
          },
          {
            label: "Пароль",
            value: "••••••••••"
          },
        ]} />
      </div>
      <Formik
          initialValues={{
            "input1": "",
          }}
          onSubmit={(values) => console.log(values)}
        >
        {({ errors, touched, handleSubmit, values }) => (
          <Form>
            <div style={{marginTop: 20}}>
              <FormLIGHT inputs={Object.entries(inputs)} setInputs={setInputs} errors={errors} touched={touched} />
            </div>
          </Form>
        )}
      </Formik>
      <Button text="Удалить пароль" style={{marginTop: 20}} />
      <FixedButton />
    </div>
  );
}

export default Password;
