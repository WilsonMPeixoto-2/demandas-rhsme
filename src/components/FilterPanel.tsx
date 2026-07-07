import React from 'react';

interface FiltrosState {
  busca: string;
  tipo: string;
  classificacao: string;
  status: string;
  setor: string;
}

interface QuickFiltersState {
  assinatura: boolean;
  hoje: boolean;
  vencido: boolean;
}

interface FilterPanelProps {
  filtros: FiltrosState;
  setFiltros: React.Dispatch<React.SetStateAction<FiltrosState>>;
  quickFilters: QuickFiltersState;
  setQuickFilters: React.Dispatch<React.SetStateAction<QuickFiltersState>>;
  setoresDisponiveis: string[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filtros,
  setFiltros,
  quickFilters,
  setQuickFilters,
  setoresDisponiveis
}) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleQuickFilter = (key: keyof QuickFiltersState) => {
    setQuickFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLimparFiltros = () => {
    // Resetar filtros textuais/selects e redefinir status para "Todos (exibir tudo)"
    setFiltros({
      busca: '',
      tipo: 'Todos',
      classificacao: 'Todas',
      status: 'Todos (exibir tudo)',
      setor: 'Todos'
    });
    // Resetar botões rápidos cumulativos
    setQuickFilters({
      assinatura: false,
      hoje: false,
      vencido: false
    });
  };

  const classificacoes = [
    'Dispensa de Ponto', 'CCFG', 'Cessão', 'Concursos', 'Contratação', 
    'Consultas', 'Inventário', 'Expediente Parlamentar', 'MP', 
    'Representação Judicial', 'DP', 'PGM', 'Recurso', 'Financeiro', 
    'Demanda Interna', 'Outros'
  ];

  const statusList = [
    'Aguardando Andamento', 'Tramitado', 'Para Assinatura', 
    'Encerrado', 'Sobrestado', 'Ajustar'
  ];

  return (
    <div className="filters-panel">
      {/* Linha superior: Ações e Botões de Atalhos rápidos */}
      <div className="filters-header">
        <div className="filters-quick-buttons">
          {/* Botões rápidos cumulativos */}
          <button 
            type="button" 
            className={`btn-toggle ${quickFilters.assinatura ? 'active' : ''}`}
            onClick={() => toggleQuickFilter('assinatura')}
          >
            Para assinatura
          </button>
          <button 
            type="button" 
            className={`btn-toggle ${quickFilters.hoje ? 'active' : ''}`}
            onClick={() => toggleQuickFilter('hoje')}
          >
            Hoje
          </button>
          <button 
            type="button" 
            className={`btn-toggle ${quickFilters.vencido ? 'active' : ''}`}
            onClick={() => toggleQuickFilter('vencido')}
          >
            Vencido
          </button>
          <button 
            type="button" 
            className="btn-toggle"
            onClick={handleLimparFiltros}
          >
            Limpar filtros
          </button>
        </div>
      </div>

      {/* Grid de campos para filtrar */}
      <div className="filters-grid">
        {/* Campo de Busca Livre (Ocupa 2 colunas) */}
        <div className="filter-group search-input-wrapper">
          <label htmlFor="busca">Busca por texto</label>
          <div className="input-icon-group">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input 
              type="text" 
              id="busca" 
              name="busca" 
              className="form-control" 
              placeholder="Buscar por número, assunto ou responsável..." 
              value={filtros.busca}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Campo Tipo */}
        <div className="filter-group">
          <label htmlFor="tipo">Tipo</label>
          <select 
            id="tipo" 
            name="tipo" 
            className="form-select" 
            value={filtros.tipo}
            onChange={handleInputChange}
          >
            <option value="Todos">Todos</option>
            <option value="Expediente">Expediente</option>
            <option value="Processo">Processo</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        {/* Campo Classificação */}
        <div className="filter-group">
          <label htmlFor="classificacao">Classificação</label>
          <select 
            id="classificacao" 
            name="classificacao" 
            className="form-select" 
            value={filtros.classificacao}
            onChange={handleInputChange}
          >
            <option value="Todas">Todas</option>
            {classificacoes.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Campo Status */}
        <div className="filter-group">
          <label htmlFor="status">Status</label>
          <select 
            id="status" 
            name="status" 
            className="form-select" 
            value={filtros.status}
            onChange={handleInputChange}
          >
            <option value="Somente ativos (padrão)">Somente ativos (padrão)</option>
            <option value="Todos (exibir tudo)">Todos (exibir tudo)</option>
            {statusList.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Campo Setor */}
        <div className="filter-group">
          <label htmlFor="setor">Setor</label>
          <select 
            id="setor" 
            name="setor" 
            className="form-select" 
            value={filtros.setor}
            onChange={handleInputChange}
          >
            <option value="Todos">Todos</option>
            {setoresDisponiveis.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
