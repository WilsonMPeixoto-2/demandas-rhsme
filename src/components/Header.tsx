import React, { useState, useEffect } from 'react';
import { Demanda } from '../types';

interface HeaderProps {
  userEmail: string;
  demandas: Demanda[];
  onLogout: () => void;
  onOpenNovo: () => void;
  onExportCSV: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  userEmail, 
  demandas, 
  onLogout,
  onOpenNovo,
  onExportCSV
}) => {
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Define o timestamp da última atualização (inicialização da sessão)
  useEffect(() => {
    const now = new Date();
    const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const dia = String(now.getDate()).padStart(2, '0');
    const mes = meses[now.getMonth()];
    const ano = now.getFullYear();
    const horas = String(now.getHours()).padStart(2, '0');
    const minutos = String(now.getMinutes()).padStart(2, '0');
    setLastUpdate(`${dia} ${mes} ${ano}, ${horas}:${minutos}`);
  }, [demandas]); // Atualiza o timestamp se houver mudança nas demandas

  // Obter data de hoje no fuso local no formato dd/mm/aaaa
  const getTodayString = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
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
      {/* 1. Faixa Institucional Compacta (De ponta a ponta na janela) */}
      <div className="institucional-bar">
        <div className="inst-left">
          <span className="inst-orgao">CTRH • Secretaria Municipal de Educação</span>
          <span className="inst-separador">|</span>
          <span className="inst-sub">Sistema interno de acompanhamento</span>
        </div>
        
        <div className="inst-right">
          {/* Usuário Logado */}
          <div className="inst-meta-item inst-user">
            <i className="fa-solid fa-user-circle"></i>
            <span>{userEmail}</span>
          </div>

          {/* Última Atualização */}
          <div className="inst-meta-item inst-timestamp" title="Momento da última modificação de dados">
            <i className="fa-solid fa-rotate"></i>
            <span>Atualizado: {lastUpdate}</span>
          </div>

          {/* Badge de Ambiente */}
          <div className="inst-badge-ambiente">
            Ambiente Local (LocalStorage)
          </div>

          {/* Botão Sair */}
          <button 
            type="button"
            className="btn-logout-link" 
            onClick={onLogout} 
            title="Sair do sistema"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* 2. Título Principal da Central de Demandas & Ações Globais */}
      <div className="title-action-row">
        <div className="title-area">
          <h1>Central de Demandas</h1>
          <p className="header-subtitle">
            Acompanhamento de processos, expedientes, prazos e providências.
          </p>
        </div>
        
        <div className="header-global-actions">
          {/* Ação Secundária: Exportar CSV */}
          <button 
            type="button"
            className="btn btn-secondary-outline" 
            onClick={onExportCSV}
            title="Exportar dados filtrados como arquivo CSV"
          >
            <i className="fa-solid fa-download"></i>
            <span>Exportar CSV</span>
          </button>

          {/* Ação Primária: Nova Demanda */}
          <button 
            type="button"
            className="btn btn-primary btn-nova-demanda-header" 
            onClick={onOpenNovo}
            title="Cadastrar nova demanda"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Nova demanda</span>
          </button>
        </div>
      </div>

      {/* 3. Cards de Indicadores (Estilo Editorial com Frisos Coloridos) */}
      <div className="stats-grid">
        <div className="stat-card total-card">
          <div className="stat-info">
            <h3>Demandas Ativas</h3>
            <div className="stat-number">{totalAtivos}</div>
          </div>
        </div>

        <div className="stat-card assinatura-card">
          <div className="stat-info">
            <h3>Para Assinatura</h3>
            <div className="stat-number">{totalAssinatura}</div>
          </div>
        </div>

        <div className="stat-card hoje-card">
          <div className="stat-info">
            <h3>Vencendo Hoje</h3>
            <div className="stat-number">{totalHoje}</div>
          </div>
        </div>

        <div className="stat-card vencido-card">
          <div className="stat-info">
            <h3>Vencidas</h3>
            <div className="stat-number">{totalVencidos}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
