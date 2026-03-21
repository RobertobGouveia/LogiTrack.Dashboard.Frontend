import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { api } from "../../services/api";
import type { DashboardResponse } from "../../type/dashboardResponse";
import { Card } from "../../components/card/card";
import ResponsiveAppBar from "../../components/header/header";
import { MainContainer } from "./dashboard.style";

type DashboardProps = {
  onLogout?: () => void;
};

export function Dashboard({ onLogout }: DashboardProps) {
  const [data, setData] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    api.get("/dashboard")
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);

  if (!data) return <Typography variant="h6" align="center" sx={{ mt: 10 }}>Carregando...</Typography>;

  return (
    <MainContainer>
      <ResponsiveAppBar onLogout={onLogout} />

      <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Painel LogiTrack
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Visão geral dos dados e próximos passos
        </Typography>

        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
          gap={3}
        >
          <Card title="Total KM percorridos" value={`${data.totalKm} km`} />
          <Card title="Custo Mensal" value={`R$ ${data.custoMensal}`} />
          <Card
            title="Veículo mais utilizado"
            value={data.rankingUtilizacao ? data.rankingUtilizacao[0] : "-"}
            subtitle={data.rankingUtilizacao ? `${data.rankingUtilizacao[1]} km rodados` : "-"}
          />
          <Card
            title="Volume por Categoria"
            value={data.volumePorCategoria[0] ? `${data.volumePorCategoria[0][0]}: ${data.volumePorCategoria[0][1]}` : "-"}
            extra={data.volumePorCategoria[1] ? `${data.volumePorCategoria[1][0]}: ${data.volumePorCategoria[1][1]}` : "-"}
          />
        </Box>

        <Paper elevation={3} sx={{ mt: 4, p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Próximas Manutenções
          </Typography>

          <List>
            {data.proximasManutencoes.length > 0 ? (
              data.proximasManutencoes.map((m, index) => (
                <Box key={index}>
                  <ListItem>
                    <ListItemText
                      primary={m.tipoServico}
                      secondary={new Date(m.dataInicio).toLocaleDateString("pt-BR")}
                    />
                  </ListItem>
                  {index < data.proximasManutencoes.length - 1 && <Divider component="li" />}
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhuma manutenção cadastrada.
              </Typography>
            )}
          </List>
        </Paper>
      </Container>
    </MainContainer>
  );
}