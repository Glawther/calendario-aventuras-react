// Arquivo: src/components/FilterBar.jsx

import React from 'react';

// Opções de Status + a opção 'Todos'
const statusOptions = ['Todos', 'Planejado', 'Agendado', 'Sonho', 'Concluído'];

const FilterBar = ({ activeFilter, onFilterChange }) => {
    
    // Estilo base do botão
    const buttonBaseStyle = {
        padding: '8px 12px', 
        margin: '5px',
        borderRadius: '20px',
        border: '1px solid #e91e63',
        cursor: 'pointer',
        transition: 'all 0.3s',
        fontSize: '13px', 
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        color: 'white',
        flexShrink: 0, 
    };

    return (
        <div style={{ margin: '20px auto', textAlign: 'center', maxWidth: '600px' }}>
            <h3 style={{ color: 'white', marginBottom: '10px' }}>Filtrar por Status:</h3>
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center',
                // Adicionado espaçamento interno para evitar que grude nas laterais
                padding: '0 5px' 
            }}>
                {statusOptions.map(status => {
                    const isActive = status === activeFilter;
                    
                    const buttonStyle = {
                        ...buttonBaseStyle,
                        backgroundColor: isActive ? '#e91e63' : 'transparent',
                        color: isActive ? 'white' : '#e91e63',
                        borderColor: isActive ? '#e91e63' : '#e91e63',
                    };
                    
                    return (
                        <button
                            key={status}
                            onClick={() => onFilterChange(status)}
                            style={buttonStyle}
                        >
                            {status}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default FilterBar;