export interface Manutencao {
  id: number;
  veiculoId?: number;
  veiculo?: {
    id: number;
    placa?: string;
    modelo?: string;
    tipo?: string;
    ano?: number;
  };
  dataInicio: string;
  dataFinalizacao?: string | null;
  tipoServico: string;
  custoEstimado: number;
  status: string;
}

export interface CreateManutencaoPayload {
  veiculoId: number;
  dataInicio: string;
  dataFinalizacao?: string;
  tipoServico: string;
  custoEstimado: number;
  status: string;
}

export interface UpdateManutencaoPayload {
  veiculoId?: number;
  dataInicio?: string;
  dataFinalizacao?: string;
  tipoServico?: string;
  custoEstimado?: number;
  status?: string;
}
