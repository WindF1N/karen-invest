import styles from './styles/DataItems.module.css';
import { useNavigate } from 'react-router-dom';

function DataItems({ items }) {

  const navigate = useNavigate();

  return (
    <div className={styles.items}>
      {items.map((item, index) => (
        <div className={styles.item} key={index} onClick={() => navigate(item.link)}>
          <div>{item.title}</div>
          <div>
            <img src={require("./images/arrow-right.svg").default} alt="" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default DataItems;
