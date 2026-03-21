export interface Veiculo {
  id: number;
  placa: string;
  modelo: string;
  tipo: string;
  ano: number;
}

export interface CreateVeiculoPayload {
  placa: string;
  modelo: string;
  tipo: string;
  ano: number;
}

export interface UpdateVeiculoPayload {
  placa?: string;
  modelo?: string;
  tipo?: string;
  ano?: number;
}
