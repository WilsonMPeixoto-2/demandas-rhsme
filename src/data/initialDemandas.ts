import { Demanda } from '../types';

export const initialDemandas: Demanda[] = [
  {
    id: 1,
    numero: '000100.002864/2026-85',
    tipo: 'Processo',
    assunto: 'Permuta servidor SEEDUC ANDRE LUIS FERREIRA GOMES Matrícula 0953740-8, Professor Docente I/18 horas Língua Portuguesa e o servidor SME RAFAEL CHAVES VASCONCELOS BARRETO matrícula 264.371-6 Professor I Geografia',
    responsavel: 'Erica',
    limite1: '01/07/2026',
    limite2: '07/07/2026', // Hoje!
    status: 'Tramitado',
    setor: 'SME',
    classificacao: 'Dispensa de Ponto'
  },
  {
    id: 2,
    numero: '000184.002702/2026-64',
    tipo: 'Processo',
    assunto: 'Cessão ANDREIA DOMINGOS MARCATTO para Câmara Municipal RJ',
    responsavel: 'Erica',
    limite1: '10/06/2026',
    limite2: '05/07/2026', // Vencido!
    status: 'Aguardando Andamento',
    setor: 'E/CTRH',
    classificacao: 'Cessão'
  },
  {
    id: 3,
    numero: '000184.006309/2026-40',
    tipo: 'Expediente',
    assunto: 'CARTA S/Nº. DATA: RJ, 23/05/2026. ASSINADO POR JORGE CARLOS DA CRUZ. SOLICITA A RENOVAÇÃO DO CONTRATO DE TRABALHO, DE PATRICIA MIRANDA DA CRUZ LIMA PEREIRA, DA 3ªCRE, NO EXERCÍCIO DA FUNÇÃO DE PROFESSORA.',
    responsavel: 'Giselle',
    limite1: '20/06/2026',
    limite2: '20/07/2026', // No prazo
    status: 'Para Assinatura', // Deve ficar verde!
    setor: 'E/CTRH',
    classificacao: 'Contratação'
  },
  {
    id: 4,
    numero: '000630.000351/2026-41',
    tipo: 'Processo',
    assunto: 'Manutenção de Permuta com substituição de um dos servidores - SUSANA LIMA DE QUEIROZ PONTES DE ARAUJO e ALESSANDRA FONTES IGLESIAS',
    responsavel: 'Erica',
    limite1: '',
    limite2: '',
    status: 'Tramitado',
    setor: 'SME',
    classificacao: 'Dispensa de Ponto'
  },
  {
    id: 5,
    numero: '000630.004212/2026-97',
    tipo: 'Outros',
    assunto: 'CUMPRIMENTO DA LEI N°15.326/26 - AEI',
    responsavel: 'Giselle',
    limite1: '',
    limite2: '07/07/2026', // Hoje!
    status: 'Ajustar',
    setor: 'CARH',
    classificacao: 'Demanda Interna'
  },
  {
    id: 6,
    numero: '000630.004254/2026-28',
    tipo: 'Outros',
    assunto: 'CUMPRIMENTO DA LEI N°15.326/26 - AEI',
    responsavel: 'Sabrina',
    limite1: '15/06/2026',
    limite2: '30/06/2026', // Vencido!
    status: 'Tramitado',
    setor: 'CARH',
    classificacao: 'Demanda Interna'
  },
  {
    id: 7,
    numero: '000630.004263/2026-19',
    tipo: 'Outros',
    assunto: 'CUMPRIMENTO DA LEI N°15.326/26 - AEI',
    responsavel: 'Sabrina',
    limite1: '',
    limite2: '',
    status: 'Sobrestado',
    setor: 'CARH',
    classificacao: 'Demanda Interna'
  },
  {
    id: 8,
    numero: '000630.004345/2026-63',
    tipo: 'Outros',
    assunto: 'REGULAMENTO DA LEI FEDERAL 15326/26 AEI',
    responsavel: 'Erica',
    limite1: '15/07/2026',
    limite2: '30/07/2026',
    status: 'Tramitado',
    setor: 'CARH',
    classificacao: 'Demanda Interna'
  },
  {
    id: 9,
    numero: '000630.004359/2026-87',
    tipo: 'Outros',
    assunto: 'REGULAMENTO DA LEI FEDERAL 15326/26 AEI',
    responsavel: 'Giselle',
    limite1: '',
    limite2: '',
    status: 'Encerrado', // Encerrado não deve ser tarjado de vermelho/amarelo mesmo com prazo vencido!
    setor: 'CARH',
    classificacao: 'Demanda Interna'
  }
];
