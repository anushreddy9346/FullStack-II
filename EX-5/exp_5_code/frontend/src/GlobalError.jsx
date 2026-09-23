import React from 'react';
import './index.css';

const GlobalError = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="global-error">
      <span>{message}</span>
      <button onClick={onClose} className="close-btn">&times;</button>
    </div>
  );
};

export default GlobalError;
