import React from "react";
import "./Header.css";
import logoText from "../../assets/logo_text.svg";
import loginButton from "../../assets/login_button.svg";

const Header = ({
  onNavigate,
  onFavoritesClick,
  onLoginClick,
  onRegisterPetClick,
}) => {
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
        <a
          href="#"
          className="nav-link"
          onClick={(e) => {
            e.preventDefault();
            if (onFavoritesClick) onFavoritesClick();
          }}
        >
          Minha Casinha
        </a>

        <a
          href="#"
          className="nav-link"
          onClick={(e) => {
            e.preventDefault();
            if (onRegisterPetClick) onRegisterPetClick();
          }}
        >
          Cadastre Pets
        </a>
      </nav>

      <img
        src={loginButton}
        alt="Login"
        className="login-button"
        onClick={onLoginClick}
      />
    </header>
  );
};

export default Header;