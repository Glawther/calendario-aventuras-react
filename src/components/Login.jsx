// Arquivo: src/components/Login.jsx

import React, { useState } from 'react';
import { useAuth } from '../firebase/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginView, setIsLoginView] = useState(true); // Alterna entre Login e Registro
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLoginView) {
                await login(email, password);
            } else {
                await signup(email, password);
            }
        } catch (err) {
            console.error(err);
            let errorMessage = "Ocorreu um erro. Verifique as credenciais.";
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                errorMessage = "Email ou senha incorretos.";
            } else if (err.code === 'auth/email-already-in-use') {
                errorMessage = "Este email já está registrado.";
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' };
    const buttonStyle = { padding: '10px', backgroundColor: '#e91e63', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

    return (
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '10px', maxWidth: '350px', margin: '40px auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#e91e63', textAlign: 'center' }}>
                {isLoginView ? 'Acessar Cantinho' : 'Registrar Novo Usuário'}
            </h2>
            
            {error && <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <input 
                    type="email" 
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    style={inputStyle}
                    required
                />
                
                <input 
                    type="password" 
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    style={inputStyle}
                    required
                />
                
                <button 
                    type="submit" 
                    disabled={loading}
                    style={buttonStyle}
                >
                    {loading ? 'Processando...' : (isLoginView ? 'Entrar' : 'Registrar')}
                </button>
            </form>

            <button
                onClick={() => setIsLoginView(!isLoginView)}
                style={{ background: 'none', border: 'none', color: '#2196f3', cursor: 'pointer', fontSize: '14px', marginTop: '15px', width: '100%' }}
            >
                {isLoginView ? 'Precisa registrar? Crie uma conta.' : 'Já tem conta? Faça login.'}
            </button>
        </div>
    );
};

export default Login;