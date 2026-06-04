import React from 'react';
import './AuthComponents.css';

export const AuthInput = ({ ...props }) => (
  <input 
    className="auth-input" 
    {...props}
  />
);

export const AuthButton = ({ children, ...props }) => (
  <button 
    className="auth-screen-button" 
    {...props}
  >
    {children}
  </button>
);

export const AuthLayout = ({ title, children, logo, footerText, onFooterClick }) => (
  <div className="auth-container">
    <div className="auth-card">
      <div className="auth-left">
        <div className="logo-wrapper">
          <img src={logo} alt="Logo" className="auth-logo" />
        </div>
      </div>
      <div className="auth-right">
        <h1 className="auth-title">{title}</h1>
        {children}
        <p className="auth-footer-text" onClick={onFooterClick}>
          {footerText.split('Clique aqui!')[0]}
          <span className="highlight">Clique aqui!</span>
        </p>
      </div>
    </div>
  </div>
);
