import styles from './styles/Banner.module.css';
import Button from './Button';

function Banner({ navigate }) {

  return (
    <div className={styles.banner}>
      <span>Не нашли что искали?<br/>Отправьте сообщение или позвоните</span>
      <div className={styles.buttons}>
        <Button text="Позвонить" />
        <Button text="Написать" />
      </div>
    </div>
  );
}

export default Banner;
