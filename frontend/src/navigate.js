import { Routes, Route } from 'react-router-dom';
import { useMainContext } from './context';
import { useEffect } from 'react';

import FixedButton from './components/FixedButton';

import Main from './screens/Main';
import Loading from './screens/Loading';

import Search from './screens/Search';
import Add from './screens/Add';
import Edit from './screens/Edit';
import Cart from './screens/Cart';
import CardRoute from './components/CardRoute';

const Navigate = () => {

  const { loading } = useMainContext();

  useEffect(() => {
    window.Telegram.WebApp.expand();
  }, [window.Telegram.WebApp])

  return (
    !loading ?
      <div>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/add" element={<Add />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search" element={<Search />} />
          <Route path="/card/:id" element={<CardRoute />} />
          <Route path="/edit/:id" element={<Edit />} />
        </Routes>
        <FixedButton />
      </div>
    :
      <Loading />
  );
};

export default Navigate;
