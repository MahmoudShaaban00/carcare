import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute(props) {

  if (localStorage.getItem('AdminToken') !== null) {
    return props.children;
  } else {
    return <Navigate to={'/login'} />;
  }
  
  return (
    <div>ProtectedRoute</div>
  )
}

