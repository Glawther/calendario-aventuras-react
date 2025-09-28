// Arquivo: src/firebase/config.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// CHAVES DE CONEXÃO OBTIDAS DO CONSOLE DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyA42o4lLIDB_B5dS1gESGO5LKelwT-ywZo",
  authDomain: "nosso-cantinho-app-334df.firebaseapp.com",
  projectId: "nosso-cantinho-app-334df",
  storageBucket: "nosso-cantinho-app-334df.firebasestorage.app",
  messagingSenderId: "787758664563",
  appId: "1:787758664563:web:9991efbcd7888045385306"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o Firestore (Banco de Dados) para que o React possa usá-lo
export const db = getFirestore(app);
export const auth = getAuth(app);