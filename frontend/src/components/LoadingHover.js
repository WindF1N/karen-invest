import styles from './styles/LoadingHover.module.css';

function LoadingHover() {

  return (
    <div className={styles.hoverWrapper}>
      <div className={styles.hover}>
        <div className={styles.loading}>
            <div className={styles.ring}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingHover;
