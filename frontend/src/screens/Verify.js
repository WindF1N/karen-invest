import styles from './styles/SignIn.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMainContext } from '../context';
import Avatar from '../components/Avatar';

function Verify() {

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type');

  const { account, verify, setLoading, error, setError } = useMainContext();

  const [activeNumber, setActiveNumber] = useState(null);
  const [code, setCode] = useState([]);
  const [previousCode, setPreviousCode] = useState([]);
  const [ isCodeIncorrect, setIsCodeIncorrect ] = useState(error ? true: false);
  const [ avatar, setAvatar ] = useState(account?.avatar);

  const handleTouchStart = (number) => {
    setActiveNumber(number);
  };

  const handleTouchEnd = () => {
    setActiveNumber(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await verify({phone: account?.phone, code: Number(code.join(''))}, navigate);
  }

  const handleNumberClick = (number) => {
    if (isCodeIncorrect) {
      setIsCodeIncorrect(false);
      setError(null);
    };
    if (number !== "Выход" && number !== "Удалить") {
      if (code.length < 4) {
        setCode([...code, number]);
      }
    } else if (number === "Удалить") {
      setCode(prevState => prevState.slice(0, -1));
    } else if (number === "Выход") {
      window.history.back();
    }
  };

  useEffect(() => {
    if (previousCode.length === 0 && code.length === 4) {
      if (type === "login") {
        handleSubmit();
      } else {
        setPreviousCode(code);
        setCode([]);
      }
    } else if (previousCode.length === 4 && code.length === 4) {
      const currentCode = code.join('');
      const previousCodeString = previousCode.join('');
      if (currentCode === previousCodeString) {
        // Код верифицирован успешно, очищаем состояние
        setIsCodeIncorrect(false);
        // Здесь выполняется действие после успешной верификации кода
        handleSubmit()
      } else {
        // Код неверен, устанавливаем флаг
        setCode([]);
        setPreviousCode([]);
        setIsCodeIncorrect(true);
      }
    }
  }, [code, previousCode])

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'Выход', 0, 'Удалить']

  return (
    <div className="view">
      <div className={styles.container}>
        
        {type !== "login" &&
        <>
          <div style={{display: "flex", flexFlow: "column", alignItems: "center", marginBottom: 50}}>
            <img src={require("./images/splash.svg").default} alt="" style={{width: 60}} />
            <div style={{fontSize: 13, fontWeight: 300, marginTop: 5, textAlign: "center", color: "#D9CBCB"}}>
              AutoLIGHT
            </div>
          </div>
          {previousCode.length === 0 ?
            <div style={{textAlign: "center", fontWeight: 300}}>Придумайте код<br/>для входа в приложение</div>
          : <div style={{textAlign: "center", fontWeight: 300}}>Повторите ранее введенный код<br/>для подтверждения</div>}
        </>}
        {type === "login" &&
          <>
            <Avatar avatar={avatar}/>
            <div style={{color: "#fff", textAlign: "center", fontWeight: 300, marginTop: -35}}>{account?.name ? account.name : account.phone}</div>
            <div style={{textAlign: "center", fontWeight: 300}}></div>
            {error &&
            <div style={{fontWeight: 300, fontSize: 12, color: "red", textAlign: "center", marginTop: -30, marginBottom: -10}}>{error}</div>}
          </>}
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", columnGap: 20}}>
          {[1, 2, 3, 4].map((_, index) => (
            <div
              key={index}
              style={{
                width: 15,
                height: 15,
                borderRadius: "50%",
                background: isCodeIncorrect ? "red" : index < code.length ? "#007BFF" : "#333",
              }}
            ></div>
          ))}
        </div>
        {type !== "login" &&
        <>
          {previousCode.length === 0 &&
            <>
            {isCodeIncorrect ? 
              <div style={{fontSize: 12, fontWeight: 300, color: "#aaa", textAlign: "center"}}>Вы ввели 2 разных кода, попробуйте ещё раз</div>
            : <div style={{fontSize: 12, fontWeight: 300, color: "#aaa", textAlign: "center"}}>В дальнейшем код будет использоваться<br/>для входа в приложение</div>}
            </>
          }
        </>}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", paddingTop: 20, width: "90%", marginLeft: "5%" }}>
          {numbers.map((number, index) => (
            <div
              key={index}
              style={{
                width: "33%",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onTouchStart={() => handleTouchStart(number)}
              onTouchEnd={handleTouchEnd}
              onClick={() => handleNumberClick(number)}
            >
              <div style={{
                fontSize: number === 'Выход' || number === 'Удалить' ? 14 : 32,
                fontWeight: number === 'Выход' || number === 'Удалить' ? 300 : 400,
                color: number === 'Выход' || number === 'Удалить' ? "#aaa" : "white",
                borderRadius: "50%",
                backgroundColor: activeNumber === number && (number !== 'Выход' && number !== 'Удалить') ? '#333' : 'transparent',
                transition: 'background-color 0.3s ease',
                width: 45,
                height: 45,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: 10
              }}>
                {number}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Verify;
