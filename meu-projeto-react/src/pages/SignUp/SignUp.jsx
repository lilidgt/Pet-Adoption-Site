import React from 'react';
import { AuthLayout, AuthInput, AuthButton } from '../../components/Auth/AuthComponents';
import onboardingLogo from '../../assets/onboarding_logo.svg';

const SignUp = ({ onSignUp, onLoginClick }) => {
  return (
    <AuthLayout 
      title="Crie sua Conta!" 
      logo={onboardingLogo}
      footerText="Já possui conta? Clique aqui!"
      onFooterClick={onLoginClick}
    >
      <form 
        className="auth-form" 
        onSubmit={(e) => {
          e.preventDefault();
          onSignUp();
        }}
      >
        <AuthInput type="text" placeholder="E-mail" required />
        <AuthInput type="password" placeholder="Senha" required />
        <AuthButton>Cadastrar</AuthButton>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
