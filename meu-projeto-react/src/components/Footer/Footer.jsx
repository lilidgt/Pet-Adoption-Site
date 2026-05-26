import React from "react";
import "./Footer.css";
import logoText from "../../assets/logo_text.svg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="div-footer">
        <img
          src={logoText}
          alt="Adote Logo Aí logo with text in the footer section"
          className="footer-logo"
        />
        <p className="footer-text">
          © 2026 Adote Logo Aí. Todos os direitos reservados para o sexto grupo.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
