import styles from './styles/Add.module.css';
import FixedButton from '../components/FixedButton';
import SearchInput from '../components/SearchInput';
import Title from '../components/Title';

function Messenger() {
  return (
    <div className={styles.view} style={{padding: "0 10px"}}>
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 5px", marginBottom: -10}}>
        <Title text="Мессенджер"/>
        <div style={{display: "flex", alignItems: "center", gap: 10}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <img src={require("../components/images/plus.svg").default} alt="" style={{width: 30, height: 30}} />
          </div>
        </div>
      </div>
      <SearchInput />
      <FixedButton />
    </div>
  );
}

export default Messenger;
