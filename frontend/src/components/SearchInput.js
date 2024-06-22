import styles from './styles/SearchInput.module.css';
import { useState, useEffect } from 'react';

function SearchInput(props) {

  const [ isFocused, setIsFocused ] = useState(false);
  const [ closing, setClosing ] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  }

  const handleCancel = () => {
    setClosing(true);
  }

  useEffect(() => {
    if (closing) {
      const timer = setTimeout(() => {
        setIsFocused(false);
        setClosing(false);
      }, 400); // 400 миллисекунд = 0.4 секунды

      // Очистка таймера при размонтировании компонента или перед следующим выполнением эффекта
      return () => clearTimeout(timer);
    }
  }, [closing]);

  return (
    <div className={styles.search}>
      <input type="text" id="search" onChange={(e) => {
        if (e.target.value !== null && e.target.value !== '') {
          document.querySelector('#searchLabel').style.display = 'none';
        } else {
          document.querySelector('#searchLabel').style.display = 'block';
        }
      }} onFocus={handleFocus}
         className={isFocused ? (!closing ? `${styles.withCancel}` : `${styles.withCancel} ${styles.closing}`) : null}/>
      <label htmlFor="search" id="searchLabel">Поиск</label>
      <img src={require("./images/search-input.svg").default} alt="search"/>
      {props.showAddButton &&
        <div className={styles.add}>
          <img src={require("./images/plus.svg").default} alt="plus" />
        </div>}
      {isFocused &&
        <div className={!closing ? `${styles.cancel}` : `${styles.cancel} ${styles.closing}`} onClick={handleCancel}>
          Отмена
        </div>}
    </div>
  );
}

export default SearchInput;
