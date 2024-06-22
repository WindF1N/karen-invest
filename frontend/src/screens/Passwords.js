import styles from './styles/Add.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import FixedButton from '../components/FixedButton';
import Title from '../components/Title';
import SearchInput from '../components/SearchInput';
import FormLIGHT from '../components/FormLIGHT';
import { Formik, Form } from 'formik';

function Passwords() {

  const navigate = useNavigate();

  const [ more, setMore ] = useState(false);
  const [ inputs, setInputs ] = useState({
    "input1": {
      value: null,
      isFocused: false,
      error: null,
      label: "Веб-сайт",
      type: "text"
    },
    "input2": {
      value: null,
      isFocused: false,
      error: null,
      label: "Имя пользователя",
      type: "text"
    },
    "input3": {
      value: null,
      isFocused: false,
      error: null,
      label: "Пароль",
      type: "text"
    },
  })

  return (
    <div className={styles.view} style={{padding: "0 10px"}}>
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 5px", marginBottom: -10}}>
        <Title text="Пароли"/>
        <div style={{display: "flex", alignItems: "center", gap: 10}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "center"}} onClick={() => setMore(true)}>
            <img src={require("../components/images/plus.svg").default} alt="" style={{width: 30, height: 30}} />
          </div>
          <div style={{fontSize: 16, fontWeight: 400 }}>
            Править
          </div>
        </div>
      </div>
      <SearchInput />
      <div style={{background: "#18181A", borderRadius: 8, marginTop: 10}}>
        <div style={{padding: 10, display: "flex", alignItems: "center", gap: 10}} onClick={() => navigate("/password")}>
          <img src={require("./images/avito.svg").default} alt="" style={{width: 30, height: 30, objectFit: "cover", padding: 10, borderRadius: 8, background: "#212121", display: "block"}} />
          <div>
            <div style={{fontSize: 16, fontWeight: 400, marginBottom: 2.5}}>avito.ru</div>
            <div style={{fontSize: 16, fontWeight: 300}}>ProlbGya.ru</div>
          </div>
          <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "auto", padding: "10px"}}>
            <img src={require("../components/images/arrow-right.svg").default} alt="" style={{height: 15}} />
          </div>
        </div>
        <div style={{padding: 10, display: "flex", alignItems: "center", gap: 10}} onClick={() => navigate("/password")}>
          <img src={require("./images/avito.svg").default} alt="" style={{width: 30, height: 30, objectFit: "cover", padding: 10, borderRadius: 8, background: "#212121", display: "block"}} />
          <div>
            <div style={{fontSize: 16, fontWeight: 400, marginBottom: 2.5}}>avito.ru</div>
            <div style={{fontSize: 16, fontWeight: 300}}>ProlbGya.ru</div>
          </div>
          <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "auto", padding: "10px"}}>
            <img src={require("../components/images/arrow-right.svg").default} alt="" style={{height: 15}} />
          </div>
        </div>
      </div>
      {more &&
        <div className={styles.moreWrapper} style={{minHeight: "100vh"}}>
          <div className={styles.more}>
            <div className={styles.header}>
              <div onClick={() => setMore(false)}>Отменить</div>
              <div style={{width: "100%", color: "#fff"}}>Добавить пароль</div>
              <div onClick={() => setMore(false)}>Готово</div>
            </div>
            <Formik
                initialValues={{
                  "input1": "",
                }}
                onSubmit={(values) => console.log(values)}
              >
              {({ errors, touched, handleSubmit, values }) => (
                <Form>
                  <div className={styles.flex20gap} style={{marginTop: 20}}>
                    <FormLIGHT inputs={Object.entries(inputs)} setInputs={setInputs} errors={errors} touched={touched} />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>}
      <FixedButton />
    </div>
  );
}

export default Passwords;
