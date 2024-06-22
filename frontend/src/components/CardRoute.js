import React from 'react';
import { Route, Navigate, useParams } from 'react-router-dom';

function CardRoute() {
  const { id } = useParams();

  return <Navigate to={`/search?card_id=${id}`} replace />;
}

export default CardRoute;