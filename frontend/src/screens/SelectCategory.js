import styles from './styles/SignIn.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMainContext } from '../context';
import FixedButton from '../components/FixedButton';
import Button from '../components/Button';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function SelectCategory() {
  const navigate = useNavigate();
  return (
    <div className="view">
      <div className={styles.container}>
        <div className={styles.title}>Новый пост!</div>
        <div style={{background: "#18181A", borderRadius: 8}}>
          <div style={{padding: "12px 15px", borderBottom: ".5px solid #212121", display: "flex", justifyContent: "space-between", alignItems: "center"}}
               onClick={() => navigate("/add/car")}>
            <div style={{fontSize: 16, fontWeight: 300}}>
              Автомобиль
            </div>
            <div style={{display: "flex"}}>
              <img src={require("../components/images/arrow-right.svg").default} alt="" />
            </div>
          </div>
          <div style={{padding: "12px 15px", display: "flex", justifyContent: "space-between", alignItems: "center"}}
               onClick={() => navigate("/add/service")}>
            <div style={{fontSize: 16, fontWeight: 300}}>
              Услуга
            </div>
            <div style={{display: "flex"}}>
              <img src={require("../components/images/arrow-right.svg").default} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectCategory;
