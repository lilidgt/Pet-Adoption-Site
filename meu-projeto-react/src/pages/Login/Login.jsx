import React, { useState } from 'react';
import { AuthLayout, AuthInput, AuthButton } from '../../components/Auth/AuthComponents';
import onboardingLogo from '../../assets/onboarding_logo.svg';

const Login = ({ onLogin, onSignUpClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Armazena os dados básicos do usuário e o token no localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.token) localStorage.setItem('token', data.token);

        alert(`Bem-vindo de volta, ${data.user.username}!`);
        onLogin(); // Chama a função que muda para a tela principal
      } else {
        alert(data.error || "E-mail ou senha incorretos.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <AuthLayout 
      title="Entre na sua Conta!" 
      logo={onboardingLogo}
      footerText="Não possui conta? Clique aqui!"
      onFooterClick={onSignUpClick}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthInput 
          type="email" 
          placeholder="E-mail" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <AuthInput 
          type="password" 
          placeholder="Senha" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <AuthButton type="submit">Entrar</AuthButton>
      </form>
    </AuthLayout>
  );
};

export default Login;

