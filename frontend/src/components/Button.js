import styles from './styles/Button.module.css';

function Button({ text, handleClick, small, style }) {

  return (
    <div className={small ? styles.smallButton : styles.button} onClick={handleClick} style={style}>{text}</div>
  );
}

export default Button;
