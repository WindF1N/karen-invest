import styles from './styles/Blocks.module.css';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

function Blocks({ items }) {

  const navigate = useNavigate();

  return (
    <div className={styles.items}>
      {items.map((item, index) => (
        <div className={styles.item} key={index} onClick={() => navigate("/posts/" + item._id)}>
          <div className={styles.image}>
            {item.images &&
            <LazyLoadImage
              alt="item"
              src={item.images[0].file}
              placeholderSrc={item.images[0].file_lazy}/>}
          </div>
          <div className={styles.information}>
            <div>{item.input5} {item.input6} {item.input7}</div>
            <div>
              1,5 (320 л.с.) 114 000 км <br/>
              Бензин, Автомат, Полный
            </div>
            <div>
              {item.input39}
            </div>
          </div>
          <div className={styles.avatar}>
            <img src={require("./images/non-avatar.svg").default} alt="" />
            <div className={styles.city}>
              Краснодар
            </div>
            <div className={styles.date}>
              {item.created_at}
            </div>
            <div className={styles.views}>
              0 просмотров
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Blocks;
