import styles from './styles/BlocksV2.module.css';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

function BlocksV2({ items }) {

  const navigate = useNavigate();

  return (
    <div className={styles.items}>
      {items.map((item, index) => (
        <div className={styles.item} key={index} onClick={() => navigate('/posts/' + item._id)}>
          <div className={styles.image}>
            {item.images &&
              <LazyLoadImage
                alt="item"
                src={item.images[0].file}
                placeholderSrc={item.images[0].file_lazy}/>}
          </div>
          <div className={styles.information}>
            <div>{item.input2}</div>
            <div>
              {item.input3}
            </div>
            <div>
              {item.input5}
            </div>
          </div>
          <div className={styles.avatar}>
            <img src={require("./images/like.svg").default} alt="" />
            <div className={styles.city}>
               Александр
            </div>
            <div className={styles.stars}>
              <img src={require("./images/stars.svg").default} alt="" />
            </div>
            <div className={styles.views}>
              3.3 млн просмотров
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BlocksV2;
