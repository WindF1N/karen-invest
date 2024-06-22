import styles from './styles/Activity.module.css';
import { useState } from 'react';
import FixedButton from '../components/FixedButton';
import FlexVariables from '../components/FlexVariables';
import Button from '../components/Button';
import Title from '../components/Title';
import { useMainContext } from '../context';
import Blocks from '../components/Blocks';
import { useNavigate } from 'react-router-dom';


function Activity() {

  const navigate = useNavigate();

  const [select, setSelect] = useState("activity");
  const [variables, setVariables] = useState([
    {
      value: "activity",
      label: "Уведомления"
    },
    {
      value: "favorites",
      label: "Избранное"
    },
    {
      value: "compare",
      label: "Сравнение"
    }
  ]);
  const [switch_, setSwitch_] = useState(false);
  const { posts } = useMainContext();
  const [transport, setTransport] = useState(posts || [])

  return (
    <>
      <div className={styles.view}>
        <Title text="Активность" />
        <FlexVariables variables={variables} select={select} setSelect={setSelect} />
      </div>
      {select === "activity" &&
      <div style={{padding: "10px 0 200px 0"}}>
        <div style={{padding: "10px", display: "flex", gap: "10px", borderBottom: ".5px solid #18181A"}}>
          <div>
            <img src={require("../components/images/non-avatar.svg").default} alt="" style={{width: "35px", height: "52.5px", objectFit: "cover", borderRadius: 4}} />
          </div>
          <div style={{paddingTop: 5, fontSize: 14, fontWeight: 300}}>
            <div>
              <b style={{fontWeight: 400}}>objectnss</b> подписался(-ась) на ваш аккаунт
            </div>
            <div style={{marginTop: 8, fontSize: 12, color: "#aaa"}}>
              2 часа назад
            </div>
          </div>
        </div>
        <div style={{padding: "10px", display: "flex", gap: "10px", borderBottom: ".5px solid #18181A"}}>
          <div>
            <img src={require("../components/images/non-avatar.svg").default} alt="" style={{width: "35px", height: "52.5px", objectFit: "cover", borderRadius: 4}} />
          </div>
          <div style={{paddingTop: 5, fontSize: 14, fontWeight: 300}}>
            <div>
              <b style={{fontWeight: 400}}>thecratxr</b> добавил(-а) ваш автомобиль в избранное
            </div>
            <div style={{marginTop: 8, fontSize: 12, color: "#aaa"}}>
              2 недели назад
            </div>
          </div>
          <div>
            <img src={require("./images/car.jpg")} alt="" style={{width: "52.5px", height: "52.5px", objectFit: "cover", borderRadius: 4}} />
          </div>
        </div>
        <div style={{padding: "10px", display: "flex", gap: "10px", borderBottom: ".5px solid #18181A"}}>
          <div>
            <img src={require("../components/images/non-avatar.svg").default} alt="" style={{width: "35px", height: "52.5px", objectFit: "cover", borderRadius: 4}} />
          </div>
          <div style={{paddingTop: 5, fontSize: 14, fontWeight: 300}}>
            <div>
              <b style={{fontWeight: 400}}>objectnss</b> оставил комментарий "<b style={{fontWeight: 400}}>привет! можно посмотреть авто?</b>" к вашему посту
            </div>
            <div style={{marginTop: 8, fontSize: 12, color: "#aaa"}}>
              2 недели назад
            </div>
          </div>
          <div>
            <img src={require("./images/car.jpg")} alt="" style={{width: "52.5px", height: "52.5px", objectFit: "cover", borderRadius: 4}} />
          </div>
        </div>
        <div style={{padding: "10px", display: "flex", gap: "10px", borderBottom: ".5px solid #18181A"}}>
          <div>
            <img src={require("../components/images/non-avatar.svg").default} alt="" style={{width: "35px", height: "52.5px", objectFit: "cover", borderRadius: 4}} />
          </div>
          <div style={{paddingTop: 5, fontSize: 14, fontWeight: 300}}>
            <div>
              <b style={{fontWeight: 400}}>thecratxr</b> поставил лайк на ваш комментарий "<b style={{fontWeight: 400}}>да можно, пишите в лс</b>"
            </div>
            <div style={{marginTop: 8, fontSize: 12, color: "#aaa"}}>
              2 недели назад
            </div>
          </div>
        </div>
      </div>}
      {select === "favorites" &&
      <div className={styles.view}>
        <div style={{padding: "10px 0 200px 0"}}>
          <Blocks items={transport} />
        </div>
      </div>}
      {select === "compare" &&
      <div style={{paddingBottom: 200}}>
        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px"}}>
          <div style={{fontSize: 16, fontWeight: 300}}>Показать только отличия</div>
          <div style={{transform: "scale(.8)", transformOrigin: "right center"}} className={styles.switch} onClick={(event) => {
            event.stopPropagation();
            if (!switch_) {
              event.currentTarget.children[0].style.transform = "translateX(73.5%)";
              event.currentTarget.style.background = "#2FD058";
              event.currentTarget.classList.add('active');
            } else {
              event.currentTarget.style.background = "#39383D";
              event.currentTarget.children[0].style.transform = "translateX(0)";
              event.currentTarget.classList.remove('active');
            };
            setSwitch_(!switch_);
          }}>
            <div></div>
          </div>
        </div>
        <div className="no-scrollbar" style={{marginTop: 0, overflowX: "scroll"}}>
          <div style={{display: "grid", gap: "10px", padding: "0 10px", gridTemplateColumns: "repeat(auto-fill, minmax(50vw, 1fr))", gridAutoFlow: "column"}}>
            <div style={{width: "50vw"}}>
              <div style={{position: "relative"}}>
                <img src={require("./images/car.jpg")} alt="" style={{borderRadius: 8, width: "100%"}} />
              </div>
              <div style={{fontSize: 18, fontWeight: 400, marginTop: 5}}>2 400 000 ₽</div>
              <div style={{fontSize: 14, fontWeight: 300, marginTop: 5}}>Mercedes-Benz McLaren 2012</div>
              <div style={{marginTop: 10, display: "flex", alignItems: "center", gap: 5}}>
                <Button text="Забронировать" small={true} />
                <div style={{position: "relative", background: "linear-gradient(180deg, rgba(102, 102, 102, 0.35) 0%, rgba(51, 51, 51, 0.50) 100%)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", padding: "2px 5px"}} onClick={() => {
                    document.getElementById(`select42`).focus()
                  }}>
                  <img src={require("./images/more.svg").default} alt="" />
                  <select id="select42" style={{opacity: 0, position: "absolute", inset: 0, width: 0, height: 0}}>
                    <option value="Написать">Написать</option>
                    <option value="Написать">Позвонить</option>
                    <option value="Написать">Заказать звонок</option>
                    <option value="Написать">Удалить</option>
                  </select>
                </div>
              </div>
              <div style={{position: "absolute", fontSize: 16, fontWeight: 400, marginTop: 20}}>Данные автомобиля</div>
              <div style={{position: "absolute", fontSize: 13, fontWeight: 300, marginTop: 50, color: "#aaa"}}>Год выпуска</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 75}}>2021</div>
              <div style={{position: "absolute", fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Двигатель</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>Бензин</div>
              <div style={{position: "absolute", fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Объём двигателя, л</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>2.0</div>
              <div style={{position: "absolute", fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Мощность, л.с.</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>250</div>
              <div style={{position: "absolute", fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Расход, л</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>8.7</div>
              <div style={{position: "absolute", fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Бак, л</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>60</div>
              <div style={{position: "absolute", fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Коробка</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>Автомат</div>
              <div style={{position: "absolute", fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Привод</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>Полный</div>
              <div style={{position: "absolute", fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Цвет</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>Синий</div>
            </div>
            <div style={{width: "50vw"}}>
              <div style={{position: "relative"}}>
                <img src={require("./images/car.jpg")} alt="" style={{borderRadius: 8, width: "100%"}} />
              </div>
              <div style={{fontSize: 18, fontWeight: 400, marginTop: 5}}>2 400 000 ₽</div>
              <div style={{fontSize: 14, fontWeight: 300, marginTop: 5}}>Mercedes-Benz McLaren 2012</div>
              <div style={{marginTop: 10, display: "flex", alignItems: "center", gap: 5}}>
                <Button text="Забронировать" small={true} />
                <div style={{position: "relative", background: "linear-gradient(180deg, rgba(102, 102, 102, 0.35) 0%, rgba(51, 51, 51, 0.50) 100%)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", padding: "2px 5px"}} onClick={() => {
                    document.getElementById(`select42`).focus()
                  }}>
                  <img src={require("./images/more.svg").default} alt="" />
                  <select id="select42" style={{opacity: 0, position: "absolute", inset: 0, width: 0, height: 0}}>
                    <option value="Написать">Написать</option>
                    <option value="Написать">Позвонить</option>
                    <option value="Написать">Заказать звонок</option>
                    <option value="Написать">Удалить</option>
                  </select>
                </div>
              </div>
              <div style={{opacity: 0, position: "absolute", left: 0, fontSize: 16, fontWeight: 400, marginTop: 20, width: "0%"}}>Данные автомобиля</div>
              <div style={{opacity: 0, position: "absolute", left: 0, fontSize: 13, fontWeight: 300, marginTop: 50, color: "#aaa"}}>Год выпуска</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 75}}>2021</div>
              <div style={{opacity: 0, position: "absolute", left: 0, fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Двигатель</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>Бензин</div>
              <div style={{opacity: 0, position: "absolute", left: 0, fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Объём двигателя, л</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>2.0</div>
              <div style={{opacity: 0, position: "absolute", left: 0, fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Мощность, л.с.</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>250</div>
              <div style={{opacity: 0, position: "absolute", left: 0, fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Расход, л</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>8.7</div>
              <div style={{opacity: 0, position: "absolute", left: 0, fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Бак, л</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>60</div>
              <div style={{opacity: 0, position: "absolute", left: 0, fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Коробка</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>Автомат</div>
              <div style={{opacity: 0, position: "absolute", left: 0, fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Привод</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>Полный</div>
              <div style={{opacity: 0, position: "absolute", left: 0, fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Цвет</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>Синий</div>
            </div>
            <div style={{width: "50vw"}}>
              <div style={{position: "relative"}}>
                <img src={require("./images/car.jpg")} alt="" style={{borderRadius: 8, width: "100%"}} />
              </div>
              <div style={{fontSize: 18, fontWeight: 400, marginTop: 5}}>2 400 000 ₽</div>
              <div style={{fontSize: 14, fontWeight: 300, marginTop: 5}}>Mercedes-Benz McLaren 2012</div>
              <div style={{marginTop: 10, display: "flex", alignItems: "center", gap: 5}}>
                <Button text="Забронировать" small={true} />
                <div style={{position: "relative", background: "linear-gradient(180deg, rgba(102, 102, 102, 0.35) 0%, rgba(51, 51, 51, 0.50) 100%)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", padding: "2px 5px"}} onClick={() => {
                    document.getElementById(`select42`).focus()
                  }}>
                  <img src={require("./images/more.svg").default} alt="" />
                  <select id="select42" style={{opacity: 0, position: "absolute", inset: 0, width: 0, height: 0}}>
                    <option value="Написать">Написать</option>
                    <option value="Написать">Позвонить</option>
                    <option value="Написать">Заказать звонок</option>
                    <option value="Написать">Удалить</option>
                  </select>
                </div>
              </div>
              <div style={{opacity: 0, position: "absolute", left: 0, fontSize: 16, fontWeight: 400, marginTop: 20, width: "0%"}}>Данные автомобиля</div>
              <div style={{opacity: 0, position: "absolute", left: 0, fontSize: 13, fontWeight: 300, marginTop: 50, color: "#aaa"}}>Год выпуска</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 75}}>2021</div>
              <div style={{opacity: 0, opacity: 0, position: "absolute", left: 0, fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Двигатель</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>Бензин</div>
              <div style={{opacity: 0, opacity: 0, position: "absolute", left: 0, fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Объём двигателя, л</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>2.0</div>
              <div style={{opacity: 0, opacity: 0, position: "absolute", left: 0, fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Мощность, л.с.</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>250</div>
              <div style={{opacity: 0, opacity: 0, position: "absolute", left: 0, fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Расход, л</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>8.7</div>
              <div style={{opacity: 0, opacity: 0, position: "absolute", left: 0, fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Бак, л</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>60</div>
              <div style={{opacity: 0, opacity: 0, position: "absolute", left: 0, fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Коробка</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>Автомат</div>
              <div style={{opacity: 0, opacity: 0, position: "absolute", left: 0, fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Привод</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>Полный</div>
              <div style={{opacity: 0, opacity: 0, position: "absolute", left: 0, fontSize: 13, fontWeight: 300, marginTop: 20, color: "#aaa"}}>Цвет</div>
              <div style={{fontSize: 16, fontWeight: 300, marginTop: 45}}>Синий</div>
            </div>
          </div>
        </div>
      </div>}
      <FixedButton />
    </>
  );
}

export default Activity;
