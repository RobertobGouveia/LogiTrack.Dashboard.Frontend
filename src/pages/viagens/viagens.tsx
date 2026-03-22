import { useEffect, useMemo, useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { api } from '../../services/api';
import type { CreateViagemPayload, UpdateViagemPayload, Viagem } from '../../type/viagem';
import type { Veiculo } from '../../type/veiculo';
import ResponsiveAppBar from '../../components/header/header';
import { MainContainer } from '../dashboard/dashboard.style';

type AppPage = 'dashboard' | 'manutencoes' | 'veiculos' | 'viagens';

type ViagensPageProps = {
  onLogout?: () => void;
  onNavigate?: (page: AppPage) => void;
};

type FormState = {
  veiculoId: string;
  veiculoPlaca: string;
  origem: string;
  destino: string;
  dataInicio: string;
  dataFim: string;
  distanciaKm: string;
  custo: string;
};

const ENDPOINT = '/viagens';

const initialForm: FormState = {
  veiculoId: '',
  veiculoPlaca: '',
  origem: '',
  destino: '',
  dataInicio: '',
  dataFim: '',
  distanciaKm: '',
  custo: '',
};

function toInputDateTime(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const localDate = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${localDate}-${month}-${day}T${hours}:${minutes}`;
}

function toApiDateTime(value: string) {
  if (!value) return '';
  return value.length === 16 ? `${value}:00` : value;
}

function formatDate(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('pt-BR');
}

function normalizeViagens(data: unknown): Viagem[] {
  const typed = data as { content?: unknown; data?: unknown } | null;

  const source = Array.isArray(data)
    ? data
    : typed && Array.isArray(typed.content)
      ? typed.content
      : typed && Array.isArray(typed.data)
        ? typed.data
        : [];

  return source.map((item) => {
    const row = item as Partial<Viagem>;
    return {
      id: Number(row.id ?? 0),
      veiculoId: row.veiculoId,
      veiculo: row.veiculo,
      origem: row.origem ?? '-',
      destino: row.destino ?? '-',
      dataInicio: row.dataInicio ?? row.dataSaida ?? '',
      dataFim: row.dataFim ?? row.dataChegada ?? null,
      distanciaKm: Number(row.distanciaKm ?? row.kmPercorrida ?? 0),
      dataSaida: row.dataSaida,
      dataChegada: row.dataChegada,
      kmPercorrida: row.kmPercorrida,
      custo: Number(row.custo ?? 0),
      status: row.status ?? '-',
    };
  });
}

function toCreatePayload(form: FormState, veiculoId: number): CreateViagemPayload {
  return {
    veiculoId,
    origem: form.origem.trim(),
    destino: form.destino.trim(),
    dataSaida: toApiDateTime(form.dataInicio),
    dataChegada: form.dataFim ? toApiDateTime(form.dataFim) : undefined,
    kmPercorrido: Number(form.distanciaKm),
  };
}

function toUpdatePayload(form: FormState, veiculoId: number): UpdateViagemPayload {
  return {
    veiculoId,
    origem: form.origem.trim(),
    destino: form.destino.trim(),
    dataInicio: form.dataInicio,
    dataFim: form.dataFim || undefined,
    distanciaKm: Number(form.distanciaKm),
    custo: Number(form.custo),
    status: 'PROGRAMADA',
  };
}

export function ViagensPage({ onLogout, onNavigate }: ViagensPageProps) {
  const [rows, setRows] = useState<Viagem[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<Viagem | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const formTitle = useMemo(() => (editingItem ? 'Editar viagem' : 'Nova viagem'), [editingItem]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(ENDPOINT);
      setRows(normalizeViagens(response.data));
    } catch {
      setError('Nao foi possivel carregar as viagens. Verifique o backend.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVeiculos = async () => {
    try {
      const response = await api.get<Veiculo[]>('/veiculos');
      setVeiculos(response.data || []);
    } catch {
      setVeiculos([]);
    }
  };

  useEffect(() => {
    fetchData();
    fetchVeiculos();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setForm(initialForm);
    setDialogOpen(true);
  };

  const openEdit = (item: Viagem) => {
    setEditingItem(item);
    setForm({
      veiculoId: String(item.veiculoId ?? item.veiculo?.id ?? ''),
      veiculoPlaca: item.veiculo?.placa ?? '',
      origem: item.origem,
      destino: item.destino,
      dataInicio: toInputDateTime(item.dataInicio ?? item.dataSaida),
      dataFim: toInputDateTime(item.dataFim ?? item.dataChegada),
      distanciaKm: String(item.distanciaKm ?? item.kmPercorrida ?? ''),
      custo: String(item.custo),
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setForm(initialForm);
  };

  const requestDelete = (id: number) => {
    setPendingDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setConfirmDeleteOpen(false);
    setPendingDeleteId(null);
  };

  const handleSave = async () => {
    if (!form.origem || !form.destino || !form.dataInicio || !form.distanciaKm) {
      setError('Preencha os campos obrigatorios da viagem.');
      return;
    }

    let veiculoId = Number(form.veiculoId);
    if (!editingItem) {
      if (!form.veiculoPlaca) {
        setError('Selecione a placa do veiculo para criar a viagem.');
        return;
      }

      const veiculoSelecionado = veiculos.find((item) => item.placa === form.veiculoPlaca);
      if (!veiculoSelecionado) {
        setError('Nao foi possivel encontrar o veiculo da placa selecionada.');
        return;
      }

      veiculoId = veiculoSelecionado.id;
    }

    const createPayload = toCreatePayload(form, veiculoId);
    const updatePayload = toUpdatePayload(form, veiculoId);

    if (Number.isNaN(veiculoId) || Number.isNaN(createPayload.kmPercorrido)) {
      setError('Confira os campos numericos (veiculo e distancia).');
      return;
    }

    try {
      if (editingItem) {
        await api.patch(`${ENDPOINT}/${editingItem.id}`, updatePayload);
        setFeedback('Viagem atualizada com sucesso.');
      } else {
        await api.post(ENDPOINT, createPayload);
        setFeedback('Viagem criada com sucesso.');
      }

      closeDialog();
      fetchData();
    } catch {
      setError('Erro ao salvar viagem. Confira os dados e tente novamente.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
      setFeedback('Viagem excluida com sucesso.');
      fetchData();
    } catch {
      setError('Erro ao excluir viagem.');
    }
  };

  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;
    await handleDelete(pendingDeleteId);
    closeDeleteDialog();
  };

  return (
    <MainContainer>
      <ResponsiveAppBar onLogout={onLogout} activePage="viagens" onNavigate={onNavigate} />

      <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight={700}>Viagens</Typography>
          </Box>

          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreate}>
            Nova viagem
          </Button>
        </Stack>

        {error ? (
          <Alert severity="error" sx={{ mt: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        ) : null}

        {feedback ? (
          <Alert severity="success" sx={{ mt: 3 }} onClose={() => setFeedback('')}>
            {feedback}
          </Alert>
        ) : null}

        <TableContainer component={Paper} elevation={3} sx={{ mt: 3, borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Placa</TableCell>
                <TableCell>Origem</TableCell>
                <TableCell>Destino</TableCell>
                <TableCell>Inicio</TableCell>
                <TableCell>Fim</TableCell>
                <TableCell>Distancia (km)</TableCell>
                <TableCell align="right">Acoes</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.veiculo?.placa ?? `ID ${item.veiculoId ?? item.veiculo?.id ?? '-'}`}</TableCell>
                  <TableCell>{item.origem}</TableCell>
                  <TableCell>{item.destino}</TableCell>
                  <TableCell>{formatDate(item.dataInicio ?? item.dataSaida)}</TableCell>
                  <TableCell>{formatDate(item.dataFim ?? item.dataChegada)}</TableCell>
                  <TableCell>{item.distanciaKm ?? item.kmPercorrida ?? 0}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => openEdit(item)}>
                      <EditRoundedIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => requestDelete(item.id)}>
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {!loading && rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                      Nenhuma viagem encontrada.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{formTitle}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {editingItem ? (
              <TextField
                label="Placa do veiculo"
                value={editingItem.veiculo?.placa ?? `ID ${form.veiculoId}`}
                fullWidth
                disabled
              />
            ) : (
              <TextField
                select
                label="Placa do veiculo"
                value={form.veiculoPlaca}
                onChange={(event) => setForm((prev) => ({ ...prev, veiculoPlaca: event.target.value }))}
                fullWidth
                required
              >
                {veiculos.length === 0 ? (
                  <MenuItem value="" disabled>
                    Nenhum veiculo disponivel
                  </MenuItem>
                ) : null}
                {veiculos.map((veiculo) => (
                  <MenuItem key={veiculo.id} value={veiculo.placa}>
                    {veiculo.placa}
                  </MenuItem>
                ))}
              </TextField>
            )}
            <TextField
              label="Origem"
              value={form.origem}
              onChange={(event) => setForm((prev) => ({ ...prev, origem: event.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Destino"
              value={form.destino}
              onChange={(event) => setForm((prev) => ({ ...prev, destino: event.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Data e hora de saida"
              type="datetime-local"
              value={form.dataInicio}
              onChange={(event) => setForm((prev) => ({ ...prev, dataInicio: event.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="Data e hora de chegada"
              type="datetime-local"
              value={form.dataFim}
              onChange={(event) => setForm((prev) => ({ ...prev, dataFim: event.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Distancia (km)"
              type="number"
              value={form.distanciaKm}
              onChange={(event) => setForm((prev) => ({ ...prev, distanciaKm: event.target.value }))}
              fullWidth
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Salvar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={closeDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir este item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>Excluir</Button>
        </DialogActions>
      </Dialog>
    </MainContainer>
  );
}
