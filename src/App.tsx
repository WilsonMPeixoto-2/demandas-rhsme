import React, { useState, useEffect } from 'react';
import { Demanda, ComentarioHistorico } from './types';
import { initialDemandas } from './data/initialDemandas';
import { Header } from './components/Header';
import { FilterPanel } from './components/FilterPanel';
import { DemandasTable } from './components/DemandasTable';
import { ModalNovo } from './components/ModalNovo';
import { ModalEditar } from './components/ModalEditar';
import { ModalStatus } from './components/ModalStatus';
import { ModalHistorico } from './components/ModalHistorico';
import { AtencaoImediata } from './components/AtencaoImediata';

export const App: React.FC = () => {
  // --- Estados de Autenticação (Simulada para rapidez local) ---
  const [userEmail, setUserEmail] = useState<string>('');
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginSenha, setLoginSenha] = useState<string>('');
  const [cadEmail, setCadEmail] = useState<string>('');
  const [cadSenha, setCadSenha] = useState<string>('');
  const [loginTab, setLoginTab] = useState<'login' | 'cadastro'>('login');
  
  // Mensagens de erro e validações
  const [erroEmail, setErroEmail] = useState<boolean>(false);
  const [senhaValida, setSenhaValida] = useState({
    minimo: false,
    maiuscula: false,
    minuscula: false,
    numero: false
  });

  // --- Estados do Aplicativo ---
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [historico, setHistorico] = useState<ComentarioHistorico[]>([]);
  const [setoresDisponiveis, setSetoresDisponiveis] = useState<string[]>([]);
  
  // --- Estados de Filtro ---
  const [filtros, setFiltros] = useState({
    busca: '',
    tipo: 'Todos',
    classificacao: 'Todas',
    status: 'Somente ativos (padrão)', // Padrão solicitado no DOCX
    setor: 'Todos'
  });

  const [quickFilters, setQuickFilters] = useState({
    assinatura: false,
    hoje: false,
    vencido: false
  });

  // --- Estados dos Modais ---
  const [modalNovoAberto, setModalNovoAberto] = useState<boolean>(false);
  const [demandaSelecionada, setDemandaSelecionada] = useState<Demanda | null>(null);
  const [modalEditarAberto, setModalEditarAberto] = useState<boolean>(false);
  const [modalStatusAberto, setModalStatusAberto] = useState<boolean>(false);
  const [modalHistoricoAberto, setModalHistoricoAberto] = useState<boolean>(false);

  // --- Efeitos e Inicialização ---
  useEffect(() => {
    // Carregar sessão se existir
    const loggedUser = localStorage.getItem('demandas_user');
    if (loggedUser) {
      setUserEmail(loggedUser);
    }

    // Carregar demandas de LocalStorage ou usar inicial da planilha demandas.xlsx
    const storedDemandas = localStorage.getItem('demandas_data');
    if (storedDemandas) {
      setDemandas(JSON.parse(storedDemandas));
    } else {
      setDemandas(initialDemandas);
      localStorage.setItem('demandas_data', JSON.stringify(initialDemandas));
    }

    // Carregar histórico de LocalStorage ou criar histórico inicial vazio
    const storedHistorico = localStorage.getItem('demandas_history');
    if (storedHistorico) {
      setHistorico(JSON.parse(storedHistorico));
    } else {
      // Cria registros de histórico iniciais de mentirinha para ilustrar o visual
      const hojeStr = new Date().toLocaleString('pt-BR');
      const mockHistorico: ComentarioHistorico[] = initialDemandas.map(d => ({
        id: d.id,
        demandaId: d.id,
        data_hora: hojeStr,
        status_novo: d.status,
        setor: d.setor || 'SME',
        comentario: 'Demanda importada da planilha inicial.'
      }));
      setHistorico(mockHistorico);
      localStorage.setItem('demandas_history', JSON.stringify(mockHistorico));
    }
  }, []);

  // Recalcular lista de setores únicos a partir de todas as demandas cadastradas
  useEffect(() => {
    const setoresUnicos = Array.from(
      new Set(
        demandas
          .map(d => d.setor?.trim())
          .filter((s): s is string => !!s)
      )
    ).sort();
    setSetoresDisponiveis(setoresUnicos);
  }, [demandas]);

  // Salvar demandas em LocalStorage
  const saveDemandas = (newDemandas: Demanda[]) => {
    setDemandas(newDemandas);
    localStorage.setItem('demandas_data', JSON.stringify(newDemandas));
  };

  // Salvar histórico em LocalStorage
  const saveHistorico = (newHistorico: ComentarioHistorico[]) => {
    setHistorico(newHistorico);
    localStorage.setItem('demandas_history', JSON.stringify(newHistorico));
  };

  // --- Validação da Senha Forte e E-mail Corporativo ---
  useEffect(() => {
    if (cadEmail && !cadEmail.toLowerCase().endsWith('@rioeduca.net')) {
      setErroEmail(true);
    } else {
      setErroEmail(false);
    }

    setSenhaValida({
      minimo: cadSenha.length >= 8,
      maiuscula: /[A-Z]/.test(cadSenha),
      minuscula: /[a-z]/.test(cadSenha),
      numero: /[0-9]/.test(cadSenha)
    });
  }, [cadEmail, cadSenha]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.toLowerCase().endsWith('@rioeduca.net')) {
      alert("Apenas e-mails do domínio @rioeduca.net são permitidos para acesso.");
      return;
    }
    if (loginSenha.length < 8) {
      alert("A senha informada deve possuir no mínimo 8 caracteres.");
      return;
    }
    
    // Simula a autenticação com sucesso
    setUserEmail(loginEmail);
    localStorage.setItem('demandas_user', loginEmail);
  };

  const handleCadastroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isSenhaForte = senhaValida.minimo && senhaValida.maiuscula && senhaValida.minuscula && senhaValida.numero;
    const isEmailValido = cadEmail.toLowerCase().endsWith('@rioeduca.net');

    if (isEmailValido && isSenhaForte) {
      alert("Solicitação de acesso simulada com sucesso! Você já pode entrar com sua conta no formulário de login.");
      setLoginTab('login');
      setLoginEmail(cadEmail);
      setCadEmail('');
      setCadSenha('');
    } else {
      alert("Por favor, atenda a todos os requisitos de segurança antes de prosseguir.");
    }
  };

  const handleLogout = () => {
    setUserEmail('');
    localStorage.removeItem('demandas_user');
  };

  // --- Operações de Dados Locais ---
  
  // Criar nova demanda
  const handleSalvarNovaDemanda = (novaDemanda: Omit<Demanda, 'id'>) => {
    const novoId = demandas.length > 0 ? Math.max(...demandas.map(d => d.id)) + 1 : 1;
    const demandaCompleta: Demanda = {
      id: novoId,
      ...novaDemanda
    };
    
    const novasDemandas = [demandaCompleta, ...demandas];
    saveDemandas(novasDemandas);
    setModalNovoAberto(false);

    // Grava um comentário inicial de criação de registro no histórico
    const hojeStr = new Date().toLocaleString('pt-BR');
    const novoComentario: ComentarioHistorico = {
      id: Date.now(),
      demandaId: novoId,
      data_hora: hojeStr,
      status_novo: novaDemanda.status,
      setor: novaDemanda.setor,
      comentario: 'Demanda cadastrada no sistema.'
    };
    saveHistorico([novoComentario, ...historico]);
  };

  // Editar dados da demanda
  const handleSalvarEdicaoDemanda = (demandaId: number, camposAlterados: Partial<Demanda>) => {
    const novasDemandas = demandas.map(d => {
      if (d.id === demandaId) {
        return { ...d, ...camposAlterados };
      }
      return d;
    });
    saveDemandas(novasDemandas);
    setModalEditarAberto(false);
    setDemandaSelecionada(null);
  };

  // Atualizar Status e Comentário (gera histórico)
  const handleAtualizarStatus = (demandaId: number, novoStatus: Demanda['status'], comentario: string) => {
    const hojeStr = new Date().toLocaleString('pt-BR');
    
    // Atualizar status na tabela
    const novasDemandas = demandas.map(d => {
      if (d.id === demandaId) {
        return { ...d, status: novoStatus };
      }
      return d;
    });
    saveDemandas(novasDemandas);

    // Encontrar setor da demanda para o histórico
    const demandaModificada = demandas.find(d => d.id === demandaId);
    const setorModificado = demandaModificada?.setor || '—';

    // Inserir comentário no histórico
    const novoComentario: ComentarioHistorico = {
      id: Date.now(),
      demandaId,
      data_hora: hojeStr,
      status_novo: novoStatus,
      setor: setorModificado,
      comentario
    };
    
    const novoHistorico = [novoComentario, ...historico];
    saveHistorico(novoHistorico);

    setModalStatusAberto(false);
    setDemandaSelecionada(null);
  };

  // Excluir demanda
  const handleExcluirDemanda = (demandaId: number) => {
    const novasDemandas = demandas.filter(d => d.id !== demandaId);
    saveDemandas(novasDemandas);
    
    // Limpar histórico daquela demanda
    const novoHistorico = historico.filter(h => h.demandaId !== demandaId);
    saveHistorico(novoHistorico);
  };

  // --- Utilitários de Filtros ---
  const getTodayString = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const isBeforeToday = (dateStr: string) => {
    if (!dateStr || dateStr === 'dd/mm/aaaa') return false;
    const [day, month, year] = dateStr.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    
    const today = new Date();
    const todayObj = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    return dateObj < todayObj;
  };

  // Lógica de filtragem dos dados
  const getDemandasFiltradas = () => {
    const todayStr = getTodayString();

    return demandas.filter(d => {
      // 1. Filtros Rápidos Cumulativos ("Hoje", "Vencido", "Para assinatura")
      const algunQuickAtivo = quickFilters.assinatura || quickFilters.hoje || quickFilters.vencido;
      
      if (algunQuickAtivo) {
        let matchQuick = false;
        
        if (quickFilters.assinatura && d.status === 'Para Assinatura') {
          matchQuick = true;
        }
        if (quickFilters.hoje && d.status !== 'Encerrado' && d.limite2 === todayStr) {
          matchQuick = true;
        }
        if (quickFilters.vencido && d.status !== 'Encerrado' && d.limite2 && isBeforeToday(d.limite2)) {
          matchQuick = true;
        }

        if (!matchQuick) return false;
      }

      // 2. Filtro de Busca por texto (Número, Assunto, Responsável)
      if (filtros.busca.trim()) {
        const buscaLower = filtros.busca.toLowerCase();
        const numMatch = d.numero.toLowerCase().includes(buscaLower);
        const assMatch = d.assunto.toLowerCase().includes(buscaLower);
        const respMatch = d.responsavel?.toLowerCase().includes(buscaLower) || false;
        
        if (!numMatch && !assMatch && !respMatch) {
          return false;
        }
      }

      // 3. Filtro de Tipo
      if (filtros.tipo !== 'Todos' && d.tipo !== filtros.tipo) {
        return false;
      }

      // 4. Filtro de Classificação
      if (filtros.classificacao !== 'Todas' && d.classificacao !== filtros.classificacao) {
        return false;
      }

      // 5. Filtro de Status
      if (filtros.status === 'Somente ativos (padrão)') {
        if (d.status === 'Encerrado') return false;
      } else if (filtros.status !== 'Todos (exibir tudo)') {
        if (d.status !== filtros.status) return false;
      }

      // 6. Filtro de Setor
      if (filtros.setor !== 'Todos' && d.setor !== filtros.setor) {
        return false;
      }

      return true;
    });
  };

  const demandasFiltradas = getDemandasFiltradas();

  // Exportar demandas filtradas como CSV
  const handleExportCSV = () => {
    if (demandasFiltradas.length === 0) {
      alert("Nenhum registro disponível para exportação na filtragem atual.");
      return;
    }

    const headers = ['ID', 'Número', 'Tipo', 'Assunto', 'Responsável', 'Limite 1', 'Limite 2', 'Status', 'Setor', 'Classificação'];
    
    const rows = demandasFiltradas.map(d => [
      d.id,
      `"${d.numero}"`,
      `"${d.tipo}"`,
      `"${d.assunto.replace(/"/g, '""')}"`,
      `"${d.responsavel || ''}"`,
      `"${d.limite1 || ''}"`,
      `"${d.limite2 || ''}"`,
      `"${d.status}"`,
      `"${d.setor || ''}"`,
      `"${d.classificacao || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `demandas_sme_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Renderização condicional: Tela de Login ou Área de Dashboard
  if (!userEmail) {
    return (
      <div className="login-bg">
        <div className="login-card">
          <div className="login-header">
            <h2>Controle de Demandas</h2>
            <p>RH — Secretaria Municipal de Educação</p>
          </div>
          
          <div className="login-tabs">
            <button 
              type="button" 
              className={`login-tab-btn ${loginTab === 'login' ? 'active' : ''}`}
              onClick={() => setLoginTab('login')}
            >
              Entrar
            </button>
            <button 
              type="button" 
              className={`login-tab-btn ${loginTab === 'cadastro' ? 'active' : ''}`}
              onClick={() => setLoginTab('cadastro')}
            >
              Primeiro Acesso
            </button>
          </div>

          {loginTab === 'login' ? (
            /* Formulário de Login */
            <form onSubmit={handleLoginSubmit}>
              <div className="login-form-group">
                <label>E-mail Corporativo</label>
                <div className="input-icon-group">
                  <i className="fa-solid fa-envelope"></i>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="usuario@rioeduca.net"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div className="login-form-group" style={{ marginBottom: '25px' }}>
                <label>Senha</label>
                <div className="input-icon-group">
                  <i className="fa-solid fa-lock"></i>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••••••"
                    value={loginSenha}
                    onChange={e => setLoginSenha(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
                Acessar Sistema
              </button>
            </form>
          ) : (
            /* Formulário de Primeiro Acesso (Solicitação) */
            <form onSubmit={handleCadastroSubmit}>
              <div className="login-form-group">
                <label>Seu E-mail Corporativo</label>
                <div className="input-icon-group">
                  <i className="fa-solid fa-envelope"></i>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="nome@rioeduca.net"
                    value={cadEmail}
                    onChange={e => setCadEmail(e.target.value)}
                    required 
                  />
                </div>
                {erroEmail && (
                  <div className="text-danger">Apenas e-mails do domínio @rioeduca.net são aceitos.</div>
                )}
              </div>
              
              <div className="login-form-group" style={{ marginBottom: '20px' }}>
                <label>Criar Nova Senha</label>
                <div className="input-icon-group">
                  <i className="fa-solid fa-lock"></i>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••••••"
                    value={cadSenha}
                    onChange={e => setCadSenha(e.target.value)}
                    required 
                  />
                </div>
                
                {/* Visualização de critérios de Senha Forte */}
                <div className="password-requirements">
                  <div className={`req-item ${senhaValida.minimo ? 'valid' : ''}`}>
                    <i className={senhaValida.minimo ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'}></i>
                    <span>Mínimo de 8 caracteres</span>
                  </div>
                  <div className={`req-item ${senhaValida.maiuscula ? 'valid' : ''}`}>
                    <i className={senhaValida.maiuscula ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'}></i>
                    <span>Pelo menos uma letra maiúscula</span>
                  </div>
                  <div className={`req-item ${senhaValida.minuscula ? 'valid' : ''}`}>
                    <i className={senhaValida.minuscula ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'}></i>
                    <span>Pelo menos uma letra minúscula</span>
                  </div>
                  <div className={`req-item ${senhaValida.numero ? 'valid' : ''}`}>
                    <i className={senhaValida.numero ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'}></i>
                    <span>Pelo menos um número</span>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '10px' }}
                disabled={!(cadEmail.toLowerCase().endsWith('@rioeduca.net') && senhaValida.minimo && senhaValida.maiuscula && senhaValida.minuscula && senhaValida.numero)}
              >
                Solicitar Aprovação
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Cabeçalho com cards de estatísticas */}
      <Header 
        userEmail={userEmail} 
        demandas={demandas} 
        onLogout={handleLogout} 
      />

      {/* Faixa de Atenção Imediata */}
      <AtencaoImediata 
        demandas={demandas}
        historico={historico}
        onOpenEditar={(d) => {
          setDemandaSelecionada(d);
          setModalEditarAberto(true);
        }}
      />

      {/* Painel de Filtros e Busca */}
      <FilterPanel 
        filtros={filtros} 
        setFiltros={setFiltros} 
        quickFilters={quickFilters}
        setQuickFilters={setQuickFilters}
        setoresDisponiveis={setoresDisponiveis}
        onOpenNovo={() => setModalNovoAberto(true)}
        onExportCSV={handleExportCSV}
      />

      {/* Tabela de Demandas */}
      <DemandasTable 
        demandas={demandasFiltradas}
        onOpenEditar={(d) => {
          setDemandaSelecionada(d);
          setModalEditarAberto(true);
        }}
        onOpenStatus={(d) => {
          setDemandaSelecionada(d);
          setModalStatusAberto(true);
        }}
        onOpenHistorico={(d) => {
          setDemandaSelecionada(d);
          setModalHistoricoAberto(true);
        }}
        onExcluir={handleExcluirDemanda}
      />

      {/* --- Modais --- */}
      
      {/* Modal Novo Registro */}
      {modalNovoAberto && (
        <ModalNovo 
          onClose={() => setModalNovoAberto(false)}
          onSalvar={handleSalvarNovaDemanda}
        />
      )}

      {/* Modal Editar Demanda */}
      {modalEditarAberto && demandaSelecionada && (
        <ModalEditar 
          demanda={demandaSelecionada}
          onClose={() => {
            setModalEditarAberto(false);
            setDemandaSelecionada(null);
          }}
          onSalvar={handleSalvarEdicaoDemanda}
        />
      )}

      {/* Modal Atualizar Status */}
      {modalStatusAberto && demandaSelecionada && (
        <ModalStatus 
          demanda={demandaSelecionada}
          onClose={() => {
            setModalStatusAberto(false);
            setDemandaSelecionada(null);
          }}
          onAtualizar={handleAtualizarStatus}
        />
      )}

      {/* Modal Histórico Comentários */}
      {modalHistoricoAberto && demandaSelecionada && (
        <ModalHistorico 
          demanda={demandaSelecionada}
          historico={historico}
          onClose={() => {
            setModalHistoricoAberto(false);
            setDemandaSelecionada(null);
          }}
        />
      )}
    </div>
  );
};
