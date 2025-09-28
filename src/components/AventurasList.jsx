// Arquivo: src/components/AventurasList.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config'; 
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore'; 

const AventurasList = ({ activeFilter }) => {
  const [aventuras, setAventuras] = useState([]); 
  const [allAventuras, setAllAventuras] = useState([]); 
  const [loading, setLoading] = useState(true);

  // Função utilitária para formatar o Timestamp do Firebase
  const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('pt-BR');
    }
    return 'Pendente'; 
  };

  const fetchAventuras = async () => {
    try {
        const colRef = collection(db, 'aventuras'); 
        const q = query(colRef, orderBy("titulo", "asc"));
        const snapshot = await getDocs(q);
        
        const aventurasData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // ORDENAÇÃO NO CLIENTE: Ordena por data (o mais próximo primeiro)
        const sortedAventuras = aventurasData.sort((a, b) => {
            const dateA = a.data && a.data.toDate ? a.data.toDate().getTime() : Infinity;
            const dateB = b.data && b.data.toDate ? b.data.toDate().getTime() : Infinity;
            return dateA - dateB;
        });

        setAllAventuras(sortedAventuras);
        setLoading(false);
    } catch (error) {
        console.error("Erro ao buscar dados do Firestore: ", error);
        setLoading(false); 
    }
  };

  useEffect(() => {
    fetchAventuras();
  }, []); 

  // LÓGICA DE FILTRAGEM
  useEffect(() => {
      if (activeFilter === 'Todos') {
          setAventuras(allAventuras);
      } else {
          const filtered = allAventuras.filter(a => a.status === activeFilter);
          setAventuras(filtered);
      }
  }, [activeFilter, allAventuras]); 
  
  // Função para alternar o status da aventura (toggle)
  const toggleStatus = async (id, currentStatus) => {
    const adventureRef = doc(db, 'aventuras', id);
    let newStatus = currentStatus === 'Concluído' ? 'Planejado' : 'Concluído';

    try {
        await updateDoc(adventureRef, { status: newStatus });
        fetchAventuras(); 
        
    } catch (error) {
        console.error("Erro ao atualizar status: ", error);
        alert("Erro ao atualizar o status. Verifique as regras do Firebase.");
    }
  };
  
  // Função para excluir a aventura
  const deleteAventura = async (id, e) => {
    e.stopPropagation(); 

    if (window.confirm("Tem certeza que deseja excluir esta aventura? Esta ação é permanente.")) {
      try {
        const adventureRef = doc(db, 'aventuras', id);
        await deleteDoc(adventureRef);
        
        fetchAventuras(); 
      } catch (error) {
        console.error("Erro ao excluir aventura: ", error);
        alert("Erro ao excluir a aventura. Tente novamente.");
      }
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: 'center', color: 'white' }}>Carregando aventuras de amor...</h2>;
  }

  // Estilos de LAYOUT GRID: Corrigido para Mobile (aplica espaçamento interno)
  const gridContainerStyle = {
    display: 'grid',
    // Colunas: Garante 1fr no celular, 2 colunas no desktop
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
    gap: '20px', 
    maxWidth: '1200px', 
    margin: '0 auto',
    // Adicionado um padding horizontal para evitar que os cartões grudem na borda da tela
    padding: '0 20px', 
    listStyle: 'none', 
  };
  
  // Estilo base do cartão
  const cardBaseStyle = { 
    padding: '20px', 
    borderRadius: '12px',
    textAlign: 'left',
    color: '#333', 
    boxShadow: '0 6px 12px rgba(0,0,0,0.3)', 
    transition: 'transform 0.2s, background-color 0.3s',
    cursor: 'pointer',
    minHeight: '150px',
    position: 'relative',
    // NOVO: Garante que o cartão ocupe 100% da sua célula Grid
    width: '100%', 
    boxSizing: 'border-box',
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif', textAlign: 'center', color: 'white' }}>
      <h1 style={{ color: 'white', margin: '30px 0' }}>🗓️ Aventuras</h1>
      
      {aventuras.length === 0 ? (
        <p style={{ color: 'white' }}>Nenhuma aventura encontrada no filtro '{activeFilter}'.</p>
      ) : (
        // Aplica o layout Grid
        <ul style={gridContainerStyle}>
          {aventuras.map(a => {
            const isConcluido = a.status === 'Concluído';
            const cardStyle = {
              ...cardBaseStyle,
              backgroundColor: isConcluido ? '#d4edda' : 'white', 
              opacity: isConcluido ? 0.7 : 1,
            };
            
            return (
              <li key={a.id} 
                  style={cardStyle}
                  // Lógica de clique no cartão para alternar o status
                  onClick={() => toggleStatus(a.id, a.status)} 
                  onMouseEnter={e => e.currentTarget.style.transform = isConcluido ? 'translateY(0)' : 'translateY(-5px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* BOTÃO DE EXCLUSÃO */}
                <button
                    onClick={(e) => deleteAventura(a.id, e)}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        fontSize: '18px',
                        cursor: 'pointer',
                        color: '#ff6b6b',
                        padding: '5px',
                        zIndex: 10,
                    }}
                    title="Excluir Aventura"
                >
                    ❌
                </button>

                {/* TÍTULO */}
                <h3 style={{ margin: '0 0 10px 0', color: isConcluido ? '#007000' : '#e91e63' }}>
                    {a.titulo} {isConcluido ? '✅' : ''}
                </h3>
                
                {/* DETALHES DA AVENTURA */}
                <p style={{ margin: '5px 0', fontSize: '15px' }}>
                  <span role="img" aria-label="Local">📍</span> Local: <strong>{a.local || 'Não definido'}</strong>
                </p>
                <p style={{ margin: '5px 0', fontSize: '15px' }}>
                  <span role="img" aria-label="Data">📅</span> Data: <strong>{formatTimestamp(a.data)}</strong></p>
                <p style={{ margin: '5px 0', fontSize: '15px' }}>
                  <span role="img" aria-label="Status">✨</span> Status: <strong>{a.status || 'Não definido'}</strong>
                </p>
                <i style={{ fontSize: '12px', color: '#666', marginTop: '10px', display: 'block' }}>
                    Clique no cartão para marcar como Concluído/Planejado
                </i>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AventurasList;