import styles from './styles/Page.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import FixedButton from '../components/FixedButton';
import Title from '../components/Title';
import { useMainContext } from '../context';

function Page() {

  const navigate = useNavigate();
  const { id } = useParams();

  const { setWhy, setWhy2 } = useMainContext();

  const [ items, setItems ] = useState([
    "Постановка транспорного средтсва на государственный учет",
    "Прекращение государственного учета транспорного средства",
    "Снятие транспорного средства с государственного учета",
    "Внесение изменений в регистрационные данные транспорного средства",
    "Возобновление государственного учета транспортного седства",
    "Востановление государственного учета транспорного средства",
    "Оформление документа, идентифицирующего транспортное средство, взамен утраченого, пришедшего в негодность или устаревшего",
    "Оформление регистрационого документа на транспорное средство в связи с вывозом за предели Российской Федерации, а так же на базовое транспорное средство или шасси транспортного средства, перегоняемое к конечным производителям или в связи с вывозом за пределы Российской Федерации"
  ]);

  const [ items2, setItems2 ] = useState([
    "Прохождением подготовки",
    "Прохождением самостоятельной подготовки",
    "Окончанием срока действия водительского удостоверения",
    "Лишением водительского удостоверения",
    "Утратой водительского удостоверения",
  ]);

  return (
    <div className={styles.view}>
      {id === "1" &&
      <div>
        <Title text={`Причина обращения в ГИБДД`}/>
        <div className={styles.items}>
          {items.map((item, index) => (
            <div className={styles.item} key={index} onClick={() => {setWhy(item);navigate(-1, {replace: true})}}>
              {item}
            </div>
          ))}
        </div>
      </div>
      }
      {id === "2" &&
      <div>
        <Title text={`ПРИЧИНА ОБРАЩЕНИЯ Заявление на замену водительского удостоверения`}/>
        <div className={styles.items}>
          {items2.map((item, index) => (
            <div className={styles.item} key={index} onClick={() => {setWhy2(item);navigate(-1, {replace: true})}}>
              {item}
            </div>
          ))}
        </div>
      </div>
      }
      <FixedButton />
    </div>
  );
}

export default Page;
