import React from 'react';
import './Header.css';
import logoText from '../../assets/logo_text.svg';
import loginButton from '../../assets/login_button.svg';

const Header = () => {
  return (
    <header className="header">
      <img src={logoText} alt="Logo" className="header-logo" />
      <nav className="header-nav">
        {/* Futuros links de navegação podem entrar aqui */}
      </nav>
      <img src={loginButton} alt="Login" className="login-button" />
    </header>
  );
};

export default Header;
