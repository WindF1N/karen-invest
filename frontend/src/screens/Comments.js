import styles from './styles/Comments.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useMainContext } from '../context';
import FixedButton from '../components/FixedButton';
import Slider from '../components/Slider';
import MiniSlider from '../components/MiniSlider';

function Comments() {

  const navigate = useNavigate();
  const { id } = useParams();
  const { accessToken, refreshToken, setMessage, message, sendMessage, account, setLoading, posts, setPosts } = useMainContext();

  const imagesDivRef = useRef();
  const commentsWrapperRef = useRef();

  const [ activeImage, setActiveImage ] = useState(null);
  const [ canSend, setCanSend ] = useState(false);
  const [ images, setImages ] = useState(posts.filter((post) => post._id === id)[0]?.images || []);
  const [ comments, setComments ] = useState([])
  const [ text, setText ] = useState('');

  const handleClick = (e) => {
    setText('');
    setCanSend(false);
    sendMessage(JSON.stringify(["comments", "add", id, text]));
  }

  const handleDelete = () => {
    setText('');
    setCanSend(false);
  }

  const handleChange = (event) => {
    setText(event.target.value);
    event.target.style.height = 'auto'; // Сбрасываем высоту перед вычислением новой
    event.target.style.height = `${event.target.scrollHeight}px`; // Устанавливаем высоту в зависимости от количества строк
    if (event.target.value) {
      setCanSend(true);
    } else {
      setCanSend(false);
    };
  }

  useEffect(() => {
    window.scrollTo({ top: 0 });
    sendMessage(JSON.stringify(["comments", "list", id]));
  }, [])

  useEffect(() => {
    if (!accessToken && !refreshToken) {
      navigate('/login', {replace: true});
    }
  }, [accessToken, refreshToken])

  useEffect(() => {
    if (images.length === 0) {
      sendMessage(JSON.stringify(["images", "get", id, "main"]));
    }
  }, [images])

  useEffect(() => {
    if (message) {
      if (message[0] === 'images') {
        if (message[1] === 'get') {
          setImages(prevState => [...prevState, ...message[2]]);
        }
      } else if (message[0] === 'comments') {
        if (message[1] === 'list') {
          setComments(message[2]);
          message[2].forEach(comment => {
            sendMessage(JSON.stringify(["user", "get", {_id: comment.user_id}]));
          })
          setTimeout(() => {
            commentsWrapperRef?.current.scrollTo({ top: commentsWrapperRef.current.scrollHeight });
          }, 100)
        } else if (message[1] === 'add') {
          setComments(prevState => [...prevState, message[2]]);
          sendMessage(JSON.stringify(["user", "get", {_id: message[2].user_id}]));
          setLoading(false);
          setPosts(prevState => {
            // Найдите пост, к которому нужно добавить изображения
            const postToUpdate = prevState.find(post => post._id === id);

            // Если пост найден, добавьте изображения
            if (postToUpdate) {
              const updatedPost = { ...postToUpdate, comments_count: postToUpdate.comments_count + 1 || 1 };

              // Замените старый пост в состоянии на обновленный
              return prevState.map(post => (post._id === id ? updatedPost : post));
            }

            // Если пост не найден, верните предыдущее состояние
            return prevState;
          });
          setTimeout(() => {
            commentsWrapperRef?.current.scrollTo({ top: commentsWrapperRef.current.scrollHeight, behavior: 'smooth' });
          }, 100)
        }
      } else if (message[0] === 'user') {
        if (message[1] == 'get') {
          setComments(prevState =>
            prevState.map(comment => ({
              ...comment,
              avatar: message[2]._id === comment.user_id ? message[2].avatar : comment.avatar,
              username: message[2]._id === comment.user_id ? (message[2].username ? message[2].username : message[2]._id) : comment.username
            }))
          );
        }
      }
      setMessage(null);
    };
  }, [message]);

  return (
    <div className="view">
      <div className={styles.wrapper}>
        <Slider images={images} imagesDivRef={imagesDivRef} setActiveImage={setActiveImage} />
        {images.length > 1 &&
          <MiniSlider images={images} imagesDivRef={imagesDivRef} activeImage={activeImage} />}
        <div className={styles.title}>
          <div>
            Комментарии <span>{comments.length}</span>
          </div>
        </div>
        <div className={styles.commentsWrapper} ref={commentsWrapperRef}>
          <div className={styles.comments}>
            {comments.length > 0 ?
              comments.map((comment) => (
                <div className={styles.comment} key={comment._id}>
                  <div>
                    <div className={styles.avatar}>
                      <img src={comment.avatar ? comment.avatar : require("../components/images/non-avatar.svg").default} alt="" />
                    </div>
                  </div>
                  <div>
                    <div>{comment.username} <b>·</b> {comment.created_at}</div>
                    <div>{comment.text}</div>
                    <div>
                      <img src={!comment.is_saved ? require("../components/images/like.svg").default : require("../components/images/like-active.svg").default} alt="" />
                    </div>
                  </div>
                </div>
              ))
            : <div className={styles.empty}>
                Пока пусто
              </div>}
          </div>
        </div>
        <div className={styles.inputComment}>
          <div className={styles.avatar}>
            <img src={account?.avatar ? account?.avatar : require("../components/images/non-avatar.svg").default} alt="" />
          </div>
          <div className={styles.textarea}>
            <textarea placeholder="Введите текст комментария" onChange={handleChange} onBlur={() => window.scrollTo({ top: 0 })} value={text}>{text}</textarea>
          </div>
        </div>
      </div>
      <FixedButton send={canSend} onClick={handleClick} onDelete={handleDelete}/>
    </div>
  );
}

export default Comments;
