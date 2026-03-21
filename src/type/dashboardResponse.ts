export interface DashboardResponse {
  totalKm: number;
  custoMensal: number;
  rankingUtilizacao: [number, number];
  volumePorCategoria: [string, number][];
  proximasManutencoes: any[];
}