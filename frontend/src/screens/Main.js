import styles from './styles/Main.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Post from '../components/Post';
import Button from '../components/Button';
import { useMainContext } from '../context';
import { useSpringRef, animated, useSpring } from '@react-spring/web';

function Main() {
  const { sendMessage, message, setMessage, theme, setTheme, account } = useMainContext();
  const wrapperApi = useSpringRef();
  const wrapperProps = useSpring({
    ref: wrapperApi,
    from: { background: theme === "Dark" ? "#000" : "#fff" },
  })
  const divApi = useSpringRef();
  const divProps = useSpring({
    ref: divApi,
    from: { transform: theme === "Dark" ? "translateX(20px)" : "translateX(0px)", background: theme === "Dark" ? "#fff" : "#000" },
  })
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const cardId = params.get('card_id');
  const navigate = useNavigate();
  const [ posts, setPosts ] = useState([]);
  const handleClick = (e) => {
    if (e.currentTarget.classList.contains('active')) {
      e.currentTarget.children[1].style.transform = 'rotate(0deg)';
      e.currentTarget.parentElement.children[1].style.height = '0';
      e.currentTarget.classList.remove('active');
    } else {
      e.currentTarget.children[1].style.transform = 'rotate(90deg)';
      e.currentTarget.parentElement.children[1].style.height = "auto";
      e.currentTarget.classList.add('active');
    }
  };
  useEffect(() => {
    window.scrollTo({top: 0, smooth: "behavior"});
    if (account.user?.username === "thecreatxr" || account.user?.username === "Mr_Romadanov") {
      sendMessage(JSON.stringify(["cards", "filter", {}, 7]));
    } else {
      sendMessage(JSON.stringify(["cards", "filter", {"is_hidden": false}, 7]));
    }
    if (cardId) {
      sendMessage(JSON.stringify(["cards", "filter", {"_id": cardId}, 1]))
    }
  }, [])
  useEffect(() => {
    if (message && window.location.pathname === "/") {
      if (message[0] === 'cards') {
        if (message[1] === 'filter') {
          setPosts(prevState => [...prevState, ...message[2].filter(item => {
            const isInMessage = prevState.some(msgItem => msgItem._id === item._id);
            return !isInMessage;
          })]);
        }
      }
      setMessage(null);
    };
  }, [message]);
  return (
    <div className="view">
      <div className={styles.header} style={{paddingBottom: 15, paddingTop: 15, borderBottom: theme === "Dark" ? "0.5px solid #e1e1e1" : "0.5px solid #18181A", marginLeft: -15, width: "100vw"}}>
        <div style={{display: "flex", alignItems: "center", gap: 15, paddingLeft: 15, paddingRight: 15, boxSizing: "border-box"}}>
          <div>
            <img src={require("./images/splash.svg").default} alt="" style={{width: 40, filter: theme === "Dark" ? "brightness(0)" : "brightness(1)"}} />
          </div>
          <div style={{marginBottom: 4}}>
            <div style={{fontSize: 20, fontWeight: 300, color: theme === "Dark" ? "#000" : "#fff"}}>Карен Инвест Сочи </div>
            <div style={{fontSize: 11, fontWeight: 300, color: theme === "Dark" ? "#444" : "#999999"}}>Агентство недвижимости | Юридические услуги </div>
          </div>
          {/* <div style={{marginLeft: "auto", display: "flex", alignItems: "center", gap: 8}}>
            <div style={{fontSize: 11, fontWeight: 300, color: theme === "Dark" ? "#000" : "#fff"}}>{theme}</div>
            <animated.div 
              style={{
                display: "flex",
                justifyContent: "flex-start",
                width: 46,
                height: 26,
                borderRadius: 26,
                background: theme === "Dark" ? "#000" : "#fff",
                ...wrapperProps
              }}
              onClick={() => {
                setTheme(prevState => {
                  if (prevState === "Light") {
                    return "Dark"
                  } else {
                    return "Light"
                  }
                })
                if (theme === "Light") {
                  wrapperApi.start({ background: "#000", config: { duration: 200 } });
                  wrapperApi.set({ background: "#000" });
                  divApi.start({ transform: "translateX(20px)", background: "#fff", config: { duration: 200 } });
                  divApi.set({ transform: "translateX(20px)", background: "#fff" });
                } else {
                  wrapperApi.start({ background: "#fff", config: { duration: 200 } });
                  wrapperApi.set({ background: "#fff" });
                  divApi.start({ transform: "translateX(0px)", background: "#000", config: { duration: 200 } });
                  divApi.set({ transform: "translateX(0px)", background: "#000" });
                }
              }}
            >
              <animated.div style={{
                backgroundColor: theme === "Dark" ? "#fff" : "#000",
                borderRadius: 26,
                height: 22,
                margin: 2,
                transition: ".2s",
                width: 22,
                ...divProps
              }}></animated.div>
            </animated.div>
          </div> */}
        </div>
      </div>
      {/* <div className={styles.block}>
        <div className={styles.itemsWrapper}>
          <div className={styles.items}>
            <div className={styles.item}>
              <span style={{zIndex: 1}}>Фотоотчёт</span>
              <div style={{zIndex: 1}}>Присылаем фото собранного букета и фотоотчёт о вручении</div>
              <img src={require("./images/photo.svg").default} alt="" style={{position: "absolute", top: 0, right: 0, width: 80, transform: "rotate(14.5deg)", filter: "brightness(.3)"}} />
            </div>
            <div className={styles.item}>
              <span style={{zIndex: 1}}>Оплата при получении</span>
              <div style={{zIndex: 1}}>Наличными курьеру или переводом</div>
              <img src={require("./images/rouble.svg").default} alt="" style={{position: "absolute", top: 0, right: -10, width: 80, transform: "rotate(14.5deg)", filter: "brightness(.3)"}} />
            </div>
            <div className={styles.item}>
              <span style={{zIndex: 1}}>Бесплатная доставка</span>
              <div style={{zIndex: 1}}>При заказе от 4500 ₽</div>
              <img src={require("./images/delivery.svg").default} alt="" style={{position: "absolute", top: 0, right: 0, width: 80, transform: "rotate(14.5deg)", filter: "brightness(.3)"}} />
            </div>
            <div className={styles.item}>
              <span style={{zIndex: 1}}>Круглосуточно</span>
              <div style={{zIndex: 1}}>Режим работы 24/7</div>
              <img src={require("./images/clock.svg").default} alt="" style={{position: "absolute", top: 0, right: 0, width: 80, transform: "rotate(14.5deg)", filter: "brightness(.3)"}} />
            </div>
          </div>
        </div>
      </div> */}
      {/* <div style={{fontSize: 14, fontWeight: 300, textAlign: "center", color: theme === "Dark" ? "#000" : "#fff"}}>
        Cвежие цветы <span style={{margin: "0 2px"}}>•</span> Доставка <span style={{margin: "0 2px"}}>•</span> Гарантия <span style={{margin: "0 2px"}}>•</span> Круглосуточно
      </div> */}
      {/* <div style={{position: "relative", width: "100%", height: "120px", borderRadius: 9, overflow: "hidden"}}>
        <img src={require("./images/woman.avif")} alt="" style={{borderRadius: 9, display: "flex", width: "100%", height: "100%", objectFit: "cover", position: "absolute", zIndex: 1}} />
        <div style={{position: "relative", 
                     boxSizing: "border-box", 
                     background: "linear-gradient(10deg, rgba(24, 24, 26, .7) 45%, rgba(24, 24, 26, 0)) 55%", 
                     width: "100%", 
                     height: "100%", 
                     zIndex: 2, 
                     padding: 15,
                     display: "flex",
                     alignItems: "flex-end"}}>
          <div style={{zIndex: 1, display: "flex", flexFlow: "column", rowGap: 5}}>
            <div style={{fontSize: 16, fontWeight: 300}}>Вы приводите клиентов - мы за это платим</div>
            <div style={{fontSize: 12, fontWeight: 300, color: "#bbb"}}>Рекомендуйте наши букеты и получаете до 2 000₽ за каждый букет, купленный по вашему промокоду</div>
          </div>
        </div>
      </div> */}
      {/* <div className={styles.posts}>
        {posts.map((post, index) => (
          <Post data={post} key={index}/>
        ))}
      </div> */}
      <div style={{display: "flex", flexWrap: "wrap", gap: 10, paddingTop: 20, borderBottom: theme === "Dark" ? "0.5px solid #e1e1e1" : "0.5px solid rgb(24, 24, 26)", paddingBottom: 20}}>
        {posts.length > 0 ?
          <>
            {posts.map((post, index) => (
              <div key={post._id}>
                {index === 2 &&
                <Post postData={post} type="old-big" basePathUrl="/" />}
                {[0, 1].includes(index) &&
                <Post postData={post} type="old-normal" basePathUrl="/" />}
                {![0, 1, 2].includes(index) &&
                <Post postData={post} type="old-normal" basePathUrl="/" />}
              </div>
            ))}
          </>
          :
          <div style={{width: "100%", height: "70vw", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <div style={{fontSize: 16, fontWeight: 300, color: theme === "Dark" ? "#444" : "#bbb"}}>Список недвижимости пуст</div>
          </div>
        }
      </div>
      {posts.length > 0 &&
      <div style={{marginTop: 15, display: "flex", justifyContent: "center", color: theme === "Dark" ? "#666" : "#bbb", fontWeight: 300, fontSize: 15, alignItems: "center", gap: 8}} onClick={() => navigate("/search")}>
        Показать всё <img src={require("../components/images/arrow-right.svg").default} alt="" style={{display: "flex", marginTop: 1, filter: theme === "Dark" ? "brightness(0.5)" : "brightness(.6)"}} />
      </div>}
      <div className={styles.information}>
        <div className={styles.informationblocks}>
          <div className={styles.informationblock} style={theme === "Dark" ? {borderBottom: "0.5px solid #e1e1e1"} : null}>
            <div className={styles.informationtitle} onClick={handleClick}>
              <span style={{fontSize: 17}}>О нас</span>  <img src={require("../components/images/arrow-right.svg").default} alt="arrow right" style={theme === "Dark" ? {filter: "brightness(0)"} : null}/>
            </div>
            <div className={styles.informationdescription}>
              <span className={styles.ptitle} style={{fontWeight: 300, paddingTop: 10, display: "block"}}>Оказываю лично комплекс услуг: аналитика цен, подбор недвижимости.</span>
              <p>
                Оперативный подбор недвижимости на первичном и вторичном рынке (т.е. предлагаю квартиры как от застройщика, так и от инвесторов), грамотная аналитика по ценам в г. Сочи, сопровождение сделки, в том числе правовая экспертиза сделки. 
              </p>
              <p>
                Вашему вниманию представлено по одному предложению из комплекса, по запросу направлю всю информацию о всех продаваемых объектах в выбранном Вами комплексе.
              </p>
              <p>
                Помогу в решениях проблем, связанных с продажей Вашей недвижимости, сопровождением сделки, подбором альтернативных вариантов приобретения недвижимости взамен продаваемой в кротчайшие сроки, согласованием условий приобретения недвижимости с применением рассрочки по оплате, скидки продавца, с использованием кредитных денежных средств банка на покупку - ипотеки, использованием денежных средств материнского семейного капитала, лично составляю все необходимые для сделки документы: договоры купли-продажи, уступки прав требования, мены, дарения, аренды и.т.п.
              </p>
              <p>
                Лично знаком со всеми застройщиками города Сочи, предлагаю квартиры как от застройщиков по ценам застройщика, так и от инвесторов (вторичный рынок недвижимости), по специальности юрист-экономист, помогу Вам выгодно приобрести недвижимость в г. Сочи.
              </p>
              <p>
                Все консультации бесплатно.
              </p>
              <p>
                Есть WhatsApp и Viber.  Со мной выгодно работать. Предлагаю только легальную недвижимость, если покупается земельный участок, то проверяется вся история оформления такого участка с момента его формирования..
              </p>
              <p>
                Свой автомобиль, покажу объекты лично, офис в центре города, свое юридическое бюро, работаю в команде адвокатов. 
              </p>
              <p>
                Огромная база уникальных объектов недвижимости по доступным ценам. Инвесторам помогу с выбором апартаментов, которые имеют максимальный потенциал к росту цены на момент покупки, что позволит получить максимальную прибыль в случае реализации таких апартаментов за наименьший период после их приобретения.
              </p>
              <p>
                Анализ цен в режиме онлайн, разработка маркетингового плана продажи.  
              </p>
              <p>
                Анализ рынка недвижимости Сочи позволит оперативно принять решение и сделать правильный выбор.
              </p>
            </div>
          </div>
          {/* <div className={styles.informationblock}>
            <div className={styles.informationtitle}>
              <span>Отзывы наших клиентов</span>
            </div>
          </div> */}
        </div>
      </div>
      <footer className={styles.footer} style={theme === "Dark" ? {borderTop: ".5px solid #e1e1e1"} : null}>
        <div className={styles.contacts} style={{flexFlow: "column", alignItems: "flex-start", gap: 10, marginTop: 20}}>
          <div className={styles.telephone} style={theme === "Dark" ? {color: "#000"} : null}><a href="tel:+79388784402" style={{ textDecoration: 'none', color: 'inherit' }}>+7 938 878 44 02</a></div>
          <div className={styles.icons}>
            <img src={require("./images/telegram.svg").default} className="" alt="telegram" />
            <img src={require("./images/whatsapp.svg").default} className="" alt="whatsapp" />
            <img src={require("./images/viber.svg").default} className="" alt="viber" />
            <img src={require("./images/vkontakte.svg").default} className="" alt="vk" />
          </div>
        </div>
        <div className={styles.labelBy}>
          powered by <span>LIGHT Business</span> © 2024
        </div>
      </footer>
    </div>
  );
}

export default Main;
