// Arquivo: src/App.jsx

import React, { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './firebase/AuthContext'; 
import AventurasList from './components/AventurasList.jsx'; 
import AdventureForm from './components/AdventureForm.jsx'; 
import Login from './components/Login.jsx'; 
import FilterBar from './components/FilterBar.jsx'; 
import './App.css'; 

// Componente Wrapper que decide o que mostrar (Login ou Conteúdo)
const AppWrapper = () => {
  const [listKey, setListKey] = useState(0); 
  const [activeFilter, setActiveFilter] = useState('Todos'); 
  const [isFormVisible, setIsFormVisible] = useState(false); // ESTADO DE VISIBILIDADE DO FORM
  const { currentUser, logout } = useAuth(); 

  const handleAdventureAdded = useCallback(() => {
    setListKey(prevKey => prevKey + 1); 
    setIsFormVisible(false); // Fecha o formulário após a adição
  }, []);

  const handleFilterChange = useCallback((newFilter) => {
    setActiveFilter(newFilter);
  }, []);

  const appStyle = { 
    minHeight: '100vh', 
    padding: '20px 0', 
    backgroundColor: '#333'
  };
  
  if (!currentUser) {
    return (
      <div style={appStyle}>
        <Login />
        <footer style={{ color: 'white', marginTop: '40px', fontSize: '12px', textAlign: 'center' }}>
            Feito com ❤️ para o nosso futuro.
        </footer>
      </div>
    );
  }

  // Estilo do botão de adição
  const addButtonStyle = {
    padding: '12px 25px',
    backgroundColor: isFormVisible ? '#ff6b6b' : '#2196f3', // Mudar cor ao expandir
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  };

  return (
    <div className="App" style={appStyle}>
      
      {/* Botões de Ação no Topo */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', paddingBottom: '20px' }}>
        <button 
          onClick={logout} 
          style={{ padding: '10px', backgroundColor: '#e91e63', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Sair ({currentUser.email.split('@')[0]})
        </button>
      </div>

      {/* NOVO: Botão de Adicionar e Container de Expansão */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button 
          onClick={() => setIsFormVisible(!isFormVisible)}
          style={addButtonStyle}
        >
          {isFormVisible ? 'Esconder Formulário ▲' : 'Adicionar Novo Plano ▼'}
        </button>
      </div>
      
      {/* Container que esconde/mostra o Formulário */}
      <div style={{ 
        height: isFormVisible ? 'auto' : '0',
        maxHeight: isFormVisible ? '500px' : '0', // Adiciona max-height para transição suave
        overflow: 'hidden',
        opacity: isFormVisible ? 1 : 0,
        transition: 'max-height 0.5s ease-in-out, opacity 0.3s ease-in-out',
        marginBottom: isFormVisible ? '30px' : '0',
      }}>
        {/* Formulário (agora centralizado) */}
        <AdventureForm onAdventureAdded={handleAdventureAdded} /> 
      </div>
      {/* FIM DA EXPANSÃO */}

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        gap: '40px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        flexWrap: 'wrap'
      }}>
        
        {/* Área Principal (Filtros e Lista) */}
        <div style={{ width: '100%', maxWidth: '900px' }}>
            <FilterBar activeFilter={activeFilter} onFilterChange={handleFilterChange} />

            {/* Lista de Aventuras */}
            <AventurasList key={listKey} activeFilter={activeFilter} /> 
        </div>

      </div>
      
      <footer style={{ color: 'white', marginTop: '40px', fontSize: '12px', textAlign: 'center' }}>
          Feito com ❤️ para o nosso futuro.
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
        <AppWrapper />
    </AuthProvider>
  )
}

export default App;