// Arquivo: src/firebase/AuthContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';
// IMPORTAÇÃO CORRIGIDA: Puxa o 'auth' exportado do config.js
import { auth } from './config'; 
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// 1. Cria o Contexto
const AuthContext = createContext();

// Hook personalizado para facilitar o uso
export const useAuth = () => {
    return useContext(AuthContext);
}

// 2. Provedor de Contexto
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        currentUser,
        signup,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children} 
        </AuthContext.Provider>
    );
};