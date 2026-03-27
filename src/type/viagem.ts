export interface Viagem {
  id: number;
  veiculoId?: number;
  veiculo?: {
    id: number;
    placa?: string;
  };
  origem: string;
  destino: string;
  dataSaida: string;
  dataChegada?: string | null;
  kmPercorrido: number;
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
  dataSaida?: string;
  dataChegada?: string;
  kmPercorrido?: number;
  custo?: number;
  status?: string;
}
