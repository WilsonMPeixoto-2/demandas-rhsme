import React from 'react';
import { Demanda, ComentarioHistorico } from '../types';

interface ModalHistoricoProps {
  demanda: Demanda;
  historico: ComentarioHistorico[];
  onClose: () => void;
}

export const ModalHistorico: React.FC<ModalHistoricoProps> = ({ demanda, historico, onClose }) => {
  // Filtrar histórico correspondente a esta demanda específica
  const historicoFiltrado = historico.filter(h => h.demandaId === demanda.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-wrapper" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Histórico de Comentários — Processo {demanda.numero}</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <div className="modal-body">
          {historicoFiltrado.length > 0 ? (
            <div className="table-responsive" style={{ maxHeight: '350px' }}>
              <table className="historico-table">
                <thead>
                  <tr>
                    <th style={{ width: '25%' }}>Data/Hora</th>
                    <th style={{ width: '20%' }}>Status</th>
                    <th style={{ width: '15%' }}>Setor</th>
                    <th style={{ width: '40%' }}>Comentário</th>
                  </tr>
                </thead>
                <tbody>
                  {historicoFiltrado.map(h => (
                    <tr key={h.id}>
                      <td style={{ textAlign: 'center' }}>{h.data_hora}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600 }} className={`badge ${h.status_novo === 'Para Assinatura' ? 'assinatura' : h.status_novo === 'Encerrado' ? 'encerrado' : 'aguardando'}`}>
                          {h.status_novo}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>{h.setor || '—'}</td>
                      <td>{h.comentario}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '20px 0', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem' }}>
              Não há histórico de alterações de status registrado para esta demanda.
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button type="button" className="btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i> Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
