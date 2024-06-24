import React from 'react';
import './styles/FixedButton.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useMainContext } from '../context';

const useDoubleClick = (callback, onSingleClick = () => {}, timeout = 150) => {
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (clickCount === 2) {
        callback();
      } else if (clickCount === 1) {
        onSingleClick();
      }
      setClickCount(0);
    }, timeout);

    return () => clearTimeout(timer);
  }, [clickCount, callback, onSingleClick, timeout]);

  return () => setClickCount(prev => prev + 1);
};

const FixedButton = (props) => {
  let location = useLocation();
  const navigate = useNavigate();
  const [ isProButtonVisible, setIsProButtonVisible ] = useState(true);
  const [ canGoBack, setCanGoBack ] = useState(false);
  const [ canScrollUp, setCanScrollUp ] = useState(false);
  const { accessToken, refreshToken, account, handleClickBackButton, cartItems } = useMainContext();

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log(accessToken && refreshToken)
  }

  const goBack = () => {
    window.history.back();
  }

  const openButtons = () => {
    setIsProButtonVisible(isProButtonVisible);
  }

  const handleDoubleClick = useDoubleClick(() => navigate('/'), openButtons);

  useEffect(() => {
    const updateCanGoBack = () => {
      setCanGoBack(window.location.pathname !== '/');
    };

    const handleScroll = () => {
      if (document.documentElement.scrollTop > 400) {
        setCanScrollUp(true);
      } else {
        setCanScrollUp(false);
      }
    };

    window.addEventListener('popstate', updateCanGoBack);
    window.addEventListener('scroll', handleScroll);

    updateCanGoBack();

    return () => {
      window.removeEventListener('popstate', updateCanGoBack);
      window.removeEventListener('scroll', handleScroll);
    }
  }, [location.pathname])

  return (
    <div className={location.pathname === '/search' ? 'upper' : null}>
      {(account?.user?.username === "thecreatxr" || account?.user?.username === "Mr_Romadanov") &&
      <div className={`fixed-button add ${isProButtonVisible ? 'visible' : ''}`} onClick={() => navigate('/add')}>
        <img src={require("./images/plus.svg").default} className="" alt="plus" />
      </div>}
      <div className={`fixed-button ${isProButtonVisible ? 'visible' : ''}`} onClick={() => navigate('/')}>
        <img src={require("./images/light-logo.svg").default} className="" alt="plus" />
      </div>
      {canGoBack &&
        <div className={"fixed-button-back"} onClick={handleClickBackButton ? handleClickBackButton : goBack}>
          <img src={require("./images/arrow-right.svg").default} className="" alt="arrow" />
        </div>}
      {(canScrollUp || props.send) &&
      <div className={`fixed-button-up ${isProButtonVisible ? 'visible' : ''} ${(account?.user?.username !== "thecreatxr" || account?.user?.username !== "Mr_Romadanov") ? 'dif' : ''}`} onClick={!props.send ? scrollUp : props.onDelete}>
        {!props.send ?
          <img src={require("./images/arrow-right.svg").default} alt="arrow" />
          : <img src={require("./images/close.svg").default} alt="arrow" style={{width: "100%"}}/> }
      </div>}
    </div>
  );
};

export default FixedButton;
