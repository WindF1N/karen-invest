import styles from './styles/RandomGrid.module.css';
import { useEffect, useState } from 'react';

function RandomGrid({ items, navigate }) {
  return (
    <div className={styles.grid}>
      {items.map((item, index) => (
        <div key={index} className={styles.item} onClick={() => navigate(item.link)}>
          <span>{item.title}</span>
          <div>{item.views_count}</div>
        </div>
      ))}
    </div>
  );
}

export default RandomGrid;
