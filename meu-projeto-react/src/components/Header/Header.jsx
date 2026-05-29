import React from 'react';
import './Header.css';
import logoText from '../../assets/logo_text.svg';
import loginButton from '../../assets/login_button.svg';

const Header = ({ onNavigate }) => {
  return (
    <header className="header">
      <img src={logoText} alt="Logo" className="header-logo" />

      <nav className="header-nav">
        <a 
          href="#" 
          className="nav-link" 
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate();
          }}
        >
          Pets para adoção
        </a>
        <a href="#" className="nav-link">Minha Casinha</a>
        <a href="#" className="nav-link">Cadastre Pets</a>
      </nav>
      
      <img src={loginButton} alt="Login" className="login-button" />
    </header>
  );
};

export default Header;
