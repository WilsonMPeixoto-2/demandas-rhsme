import React from 'react';
import { Demanda } from '../types';

interface DemandasTableProps {
  demandas: Demanda[];
  onOpenEditar: (demanda: Demanda) => void;
  onOpenStatus: (demanda: Demanda) => void;
  onOpenHistorico: (demanda: Demanda) => void;
  onExcluir: (id: number) => void;
}

export const DemandasTable: React.FC<DemandasTableProps> = ({
  demandas,
  onOpenEditar,
  onOpenStatus,
  onOpenHistorico,
  onExcluir
}) => {

  const getTodayString = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const todayStr = getTodayString();

  const isToday = (dateStr: string) => {
    if (!dateStr || dateStr === 'dd/mm/aaaa') return false;
    return dateStr === todayStr;
  };

  const isBeforeToday = (dateStr: string) => {
    if (!dateStr || dateStr === 'dd/mm/aaaa') return false;
    const [day, month, year] = dateStr.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    
    const today = new Date();
    const todayObj = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    return dateObj < todayObj;
  };

  // Retorna a classe da linha baseada no status e datas limites
  const getRowClass = (d: Demanda) => {
    if (d.status === 'Encerrado') return '';

    if (d.status === 'Para Assinatura') {
      return 'row-assinatura';
    }

    if (d.limite2) {
      if (isToday(d.limite2)) {
        return 'row-hoje';
      }
      if (isBeforeToday(d.limite2)) {
        return 'row-vencido';
      }
    }

    return '';
  };

  // Retorna a classe CSS da badge de status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Aguardando Andamento': return 'badge aguardando';
      case 'Tramitado': return 'badge tramitado';
      case 'Para Assinatura': return 'badge assinatura';
      case 'Encerrado': return 'badge encerrado';
      case 'Sobrestado': return 'badge sobrestado';
      case 'Ajustar': return 'badge ajustar';
      default: return 'badge';
    }
  };

  const handleExcluirClick = (id: number, numero: string) => {
    const confirmar = window.confirm(`Tem certeza que deseja excluir a demanda do processo nº ${numero}?`);
    if (confirmar) {
      onExcluir(id);
    }
  };

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="demandas-table">
          <thead>
            <tr>
              <th>Número</th>
              <th style={{ width: '38%' }}>Assunto</th>
              <th>Responsável</th>
              <th>Limite 1</th>
              <th>Limite 2</th>
              <th>Status</th>
              <th>Setor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {demandas.length > 0 ? (
              demandas.map(d => (
                <tr key={d.id} className={getRowClass(d)}>
                  {/* Número */}
                  <td>
                    <span 
                      className="numero-link" 
                      onClick={() => onOpenEditar(d)}
                      title="Clique para editar este registro"
                    >
                      {d.numero}
                    </span>
                  </td>
                  
                  {/* Assunto (Alinhado à esquerda e limitado a 2 linhas) */}
                  <td className="text-start-cell">
                    <div className="limite-linhas" title={d.assunto}>
                      {d.assunto}
                    </div>
                  </td>
                  
                  {/* Responsável */}
                  <td>{d.responsavel || '—'}</td>
                  
                  {/* Limite 1 */}
                  <td>{d.limite1 && d.limite1 !== 'dd/mm/aaaa' ? d.limite1 : '—'}</td>
                  
                  {/* Limite 2 */}
                  <td>{d.limite2 && d.limite2 !== 'dd/mm/aaaa' ? d.limite2 : '—'}</td>
                  
                  {/* Status */}
                  <td>
                    <span className={getStatusBadgeClass(d.status)}>
                      {d.status}
                    </span>
                  </td>
                  
                  {/* Setor */}
                  <td>{d.setor || '—'}</td>
                  
                  {/* Ações */}
                  <td>
                    <div className="acoes-cell">
                      <button 
                        className="btn-icon" 
                        onClick={() => onOpenHistorico(d)} 
                        title="Histórico de Comentários"
                      >
                        <i className="fa-solid fa-file-lines"></i>
                      </button>
                      <button 
                        className="btn-icon" 
                        onClick={() => onOpenStatus(d)} 
                        title="Mudar Status"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button 
                        className="btn-icon" 
                        onClick={() => onOpenEditar(d)} 
                        title="Editar Demanda"
                      >
                        <i className="fa-solid fa-file-signature"></i>
                      </button>
                      <button 
                        className="btn-icon delete" 
                        onClick={() => handleExcluirClick(d.id, d.numero)} 
                        title="Excluir Registro"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ padding: '30px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Nenhuma demanda encontrada para os filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
