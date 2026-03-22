export interface Viagem {
  id: number;
  veiculoId?: number;
  veiculo?: {
    id: number;
    placa?: string;
  };
  origem: string;
  destino: string;
  dataInicio: string;
  dataFim?: string | null;
  distanciaKm: number;
  dataSaida?: string;
  dataChegada?: string | null;
  kmPercorrida?: number;
  custo: number;
  status: string;
}

export interface CreateViagemPayload {
  veiculoId: number;
  origem: string;
  destino: string;
  dataSaida: string;
  dataChegada?: string;
  kmPercorrido: number;
}

export interface UpdateViagemPayload {
  veiculoId?: number;
  origem?: string;
  destino?: string;
  dataInicio?: string;
  dataFim?: string;
  distanciaKm?: number;
  custo?: number;
  status?: string;
}
