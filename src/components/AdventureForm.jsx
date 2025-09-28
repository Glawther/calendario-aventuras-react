// Arquivo: src/components/AdventureForm.jsx

import React, { useState } from 'react';
import { db } from '../firebase/config'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 

const AdventureForm = ({ onAdventureAdded }) => {
    const [titulo, setTitulo] = useState('');
    const [local, setLocal] = useState('');
    const [status, setStatus] = useState('Planejado');
    const [dataAgendada, setDataAgendada] = useState(''); // Estado para a data
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!titulo || !local) {
            alert("Por favor, preencha o Título e o Local da aventura.");
            return;
        }

        setLoading(true);
        
        // Lógica para definir o campo 'data' no Firestore
        let adventureDate;
        
        if (dataAgendada) {
             // Converte a string de data (YYYY-MM-DD) para um objeto Date
             adventureDate = new Date(dataAgendada);
        } else {
             adventureDate = serverTimestamp(); // Timestamp genérico para planos sem data
        }

        try {
            const newAdventure = {
                titulo,
                local,
                status,
                data: adventureDate 
            };
            
            const colRef = collection(db, 'aventuras');
            await addDoc(colRef, newAdventure);
            
            alert(`Aventura "${titulo}" adicionada com sucesso!`);
            
            onAdventureAdded(); // Recarrega a lista
            
            // Limpa o formulário
            setTitulo('');
            setLocal('');
            setStatus('Planejado');
            setDataAgendada(''); 

        } catch (error) {
            console.error("Erro ao adicionar aventura: ", error);
            alert("Erro ao salvar a aventura. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    // Estilo auxiliar para os inputs
    const inputStyle = {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '16px'
    };

    // CORREÇÃO AQUI: Margem centralizada no App.jsx, aqui só o estilo do container.
    return (
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '10px', minWidth: '300px', maxWidth: '400px', margin: '0 auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#333', textAlign: 'center' }}>Adicionar Novo Plano 📝</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <input 
                    type="text" 
                    placeholder="Título da Aventura"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    disabled={loading}
                    style={inputStyle}
                />
                
                <input 
                    type="text" 
                    placeholder="Local"
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    disabled={loading}
                    style={inputStyle}
                />
                
                {/* CAMPO DE DATA */}
                <input 
                    type="date" 
                    value={dataAgendada}
                    onChange={(e) => setDataAgendada(e.target.value)}
                    disabled={loading}
                    style={inputStyle}
                />

                <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={loading}
                    style={inputStyle}
                >
                    <option value="Planejado">Planejado</option>
                    <option value="Agendado">Agendado (Data Definida)</option>
                    <option value="Sonho">Sonho (Longo Prazo)</option>
                    <option value="Concluído">Concluído!</option>
                </select>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ padding: '10px', backgroundColor: '#e91e63', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    {loading ? 'Salvando...' : 'Salvar Aventura'}
                </button>
            </form>
        </div>
    );
};

export default AdventureForm;