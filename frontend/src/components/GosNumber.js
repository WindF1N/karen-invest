import styles from './styles/GosNumber.module.css';
import rus from '../screens/images/rus.svg';

function GosNumber({size, number, region}) {

  return (
    <div className={styles.gosnumber} style={size ? {transform: "scale("+size+")"} : null}>
        <input type="text" placeholder="м555мм" value={number} disabled={number ? true : false} />
        <div>
            <input type="text" placeholder="125" value={region} disabled={region ? true : false} />
            <div>
                RUS <img src={rus} alt="" />
            </div>
        </div>
    </div>
  );
}

export default GosNumber;
