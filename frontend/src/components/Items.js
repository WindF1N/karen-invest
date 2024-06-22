import styles from './styles/Items.module.css';

function Items({ items }) {

  return (
    <div className={styles.items}>
      {items.map((item, index) => (
        <div className={styles.item} key={index}>
          <div>{item.label}</div>
          <div>{item.value}</div>
        </div>
      ))}
    </div>
  );
}

export default Items;
