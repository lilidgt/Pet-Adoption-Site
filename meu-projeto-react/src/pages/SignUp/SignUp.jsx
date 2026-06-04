import React from 'react';
import './SignUp.css';
import onboardingLogo from '../../assets/onboarding_logo.svg';

const SignUp = ({ onSignUp, onLoginClick }) => {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <div className="logo-wrapper">
            <img src={onboardingLogo} alt="Onboarding Logo" className="login-logo" />
          </div>
        </div>
        <div className="login-right">
          <h1 className="login-title">Crie sua Conta!</h1>
          <form 
            className="login-form" 
            onSubmit={(e) => {
              e.preventDefault();
              onSignUp();
            }}
          >
            <input 
              type="text" 
              placeholder="E-mail" 
              className="login-input" 
              required
            />
            <input 
              type="password" 
              placeholder="Senha" 
              className="login-input" 
              required
            />
            <button type="submit" className="login-screen-button">
              Cadastrar
            </button>
            <p className="login-signup-text" onClick={onLoginClick}>
              Já possui conta? <span className="highlight">Clique aqui!</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
