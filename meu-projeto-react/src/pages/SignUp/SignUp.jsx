import React, { useState } from 'react';
import { AuthLayout, AuthInput, AuthButton } from '../../components/Auth/AuthComponents';
import onboardingLogo from '../../assets/onboarding_logo.svg';
import './SignUp.css';

const SignUp = ({ onSignUp, onLoginClick }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    isAdotante: false,
    isDoador: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignUp(formData);
  };

  return (
    <AuthLayout 
      title="Crie sua Conta!" 
      logo={onboardingLogo}
      footerText="Já possui conta? Clique aqui!"
      onFooterClick={onLoginClick}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthInput 
          name="username"
          type="text" 
          placeholder="Nome/Username" 
          value={formData.username}
          onChange={handleChange}
          required 
        />
        <AuthInput 
          name="email"
          type="email" 
          placeholder="E-mail" 
          value={formData.email}
          onChange={handleChange}
          required 
        />
        <AuthInput 
          name="password"
          type="password" 
          placeholder="Senha" 
          value={formData.password}
          onChange={handleChange}
          required 
        />
        
        <div className="signup-roles">
          <label className="signup-checkbox-label">
            <input 
              type="checkbox" 
              name="isAdotante"
              checked={formData.isAdotante}
              onChange={handleChange}
            />
            <span>Adotante</span>
          </label>
          <label className="signup-checkbox-label">
            <input 
              type="checkbox" 
              name="isDoador"
              checked={formData.isDoador}
              onChange={handleChange}
            />
            <span>Doador</span>
          </label>
        </div>

        <AuthButton type="submit">Cadastrar</AuthButton>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
