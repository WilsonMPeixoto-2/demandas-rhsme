import React from 'react';
import { Demanda } from '../types';

interface HeaderProps {
  userEmail: string;
  demandas: Demanda[];
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userEmail, demandas, onLogout }) => {
  // Obter data de hoje no fuso local no formato dd/mm/aaaa
  const getTodayString = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const todayStr = getTodayString();

  // Função auxiliar para comparar se a data limite é menor que hoje
  const isBeforeToday = (dateStr: string) => {
    if (!dateStr || dateStr === 'dd/mm/aaaa') return false;
    const [day, month, year] = dateStr.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    
    const today = new Date();
    const todayObj = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    return dateObj < todayObj;
  };

  // Contadores
  const totalAtivos = demandas.filter(d => d.status !== 'Encerrado').length;
  const totalAssinatura = demandas.filter(d => d.status === 'Para Assinatura').length;
  const totalHoje = demandas.filter(d => d.status !== 'Encerrado' && d.limite2 === todayStr).length;
  const totalVencidos = demandas.filter(d => d.status !== 'Encerrado' && d.limite2 && isBeforeToday(d.limite2)).length;

  return (
    <header className="header-container">
      {/* Barra superior de título e conta */}
      <div className="header-layout">
        <div className="header-title-area">
          <h1>Controle de Demandas</h1>
          <p>RH — Secretaria Municipal de Educação (SME)</p>
        </div>
        
        <div className="header-actions">
          <div className="user-badge">
            <i className="fa-solid fa-user-circle fa-lg"></i>
            <span>{userEmail}</span>
          </div>
          <button className="btn" onClick={onLogout} title="Sair do sistema">
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Cards de Indicadores */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Demandas Ativas</h3>
            <div className="stat-number">{totalAtivos}</div>
          </div>
          <div className="stat-icon total">
            <i className="fa-solid fa-folder-open"></i>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Para Assinatura</h3>
            <div className="stat-number">{totalAssinatura}</div>
          </div>
          <div className="stat-icon assinatura">
            <i className="fa-solid fa-file-signature"></i>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Vencendo Hoje</h3>
            <div className="stat-number">{totalHoje}</div>
          </div>
          <div className="stat-icon hoje">
            <i className="fa-solid fa-clock-rotate-left"></i>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Vencidas</h3>
            <div className="stat-number">{totalVencidos}</div>
          </div>
          <div className="stat-icon vencido">
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
        </div>
      </div>
    </header>
  );
};
