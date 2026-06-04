import React from 'react';
import { AuthLayout, AuthInput, AuthButton } from '../../components/Auth/AuthComponents';
import onboardingLogo from '../../assets/onboarding_logo.svg';

const Login = ({ onLogin, onSignUpClick }) => {
  return (
    <AuthLayout 
      title="Entre na sua Conta!" 
      logo={onboardingLogo}
      footerText="Não possui conta? Clique aqui!"
      onFooterClick={onSignUpClick}
    >
      <form 
        className="auth-form" 
        onSubmit={(e) => {
          e.preventDefault();
          onLogin();
        }}
      >
        <AuthInput type="text" placeholder="E-mail" required />
        <AuthInput type="password" placeholder="Senha" required />
        <AuthButton>Entrar</AuthButton>
      </form>
    </AuthLayout>
  );
};

export default Login;
