import styles from './styles/FlexVariables.module.css';
import { useState } from 'react';

function FlexVariables({ variables, select, setSelect }) {

  return (
    <div className={styles.wrapper}>
      <div className={styles.flexVariables}>
        {variables.map((v, index) => (
          <div className={select == v.value ? styles.variableActive : styles.variable} onClick={() => setSelect(v.value)} key={index}>
            <span>{v.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlexVariables;
