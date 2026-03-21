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
import type { CreateVeiculoPayload, UpdateVeiculoPayload, Veiculo } from '../../type/veiculo';
import ResponsiveAppBar from '../../components/header/header';
import { MainContainer } from '../dashboard/dashboard.style';

type AppPage = 'dashboard' | 'manutencoes' | 'veiculos' | 'viagens';

type VeiculosPageProps = {
  onLogout?: () => void;
  onNavigate?: (page: AppPage) => void;
};

type FormState = {
  placa: string;
  modelo: string;
  tipo: string;
  ano: string;
};

const ENDPOINT = '/veiculos';

const initialForm: FormState = {
  placa: '',
  modelo: '',
  tipo: '',
  ano: '',
};

function toPayload(form: FormState): CreateVeiculoPayload {
  return {
    placa: form.placa.trim(),
    modelo: form.modelo.trim(),
    tipo: form.tipo.trim().toUpperCase(),
    ano: Number(form.ano),
  };
}

export function VeiculosPage({ onLogout, onNavigate }: VeiculosPageProps) {
  const [rows, setRows] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<Veiculo | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const formTitle = useMemo(() => (editingItem ? 'Editar veículo' : 'Novo veículo'), [editingItem]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get<Veiculo[]>(ENDPOINT);
      setRows(response.data || []);
    } catch {
      setError('Nao foi possivel carregar os veiculos. Verifique o backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setForm(initialForm);
    setDialogOpen(true);
  };

  const openEdit = (item: Veiculo) => {
    setEditingItem(item);
    setForm({
      placa: item.placa,
      modelo: item.modelo,
      tipo: item.tipo,
      ano: String(item.ano),
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
    if (!form.placa || !form.modelo || !form.tipo || !form.ano) {
      setError('Preencha os campos obrigatorios: placa, modelo, tipo e ano.');
      return;
    }

    const payload = toPayload(form);
    if (!Number.isInteger(payload.ano) || payload.ano < 1900) {
      setError('Informe um ano valido.');
      return;
    }

    try {
      if (editingItem) {
        const updatePayload: UpdateVeiculoPayload = payload;
        await api.patch(`${ENDPOINT}/${editingItem.id}`, updatePayload);
        setFeedback('Veículo atualizado com sucesso.');
      } else {
        await api.post(ENDPOINT, payload);
        setFeedback('Veículo criado com sucesso.');
      }

      closeDialog();
      fetchData();
    } catch {
      setError('Erro ao salvar veículo. Confira os dados e tente novamente.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
      setFeedback('Veículo excluido com sucesso.');
      fetchData();
    } catch {
      setError('Erro ao excluir veículo.');
    }
  };

  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;
    await handleDelete(pendingDeleteId);
    closeDeleteDialog();
  };

  return (
    <MainContainer>
      <ResponsiveAppBar onLogout={onLogout} activePage="veiculos" onNavigate={onNavigate} />

      <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight={700}>Veículos</Typography>
            <Typography variant="subtitle1" color="text.secondary">Gerencie o CRUD de veículos.</Typography>
          </Box>

          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreate}>
            Novo veículo
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
                <TableCell>Modelo</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Ano</TableCell>
                <TableCell align="right">Acoes</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.placa}</TableCell>
                  <TableCell>{item.modelo}</TableCell>
                  <TableCell>{item.tipo}</TableCell>
                  <TableCell>{item.ano}</TableCell>
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
                  <TableCell colSpan={6}>
                    <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                      Nenhum veículo encontrado.
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
            <TextField
              label="Placa"
              value={form.placa}
              onChange={(event) => setForm((prev) => ({ ...prev, placa: event.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Modelo"
              value={form.modelo}
              onChange={(event) => setForm((prev) => ({ ...prev, modelo: event.target.value }))}
              fullWidth
              required
            />
            <TextField
              select
              label="Tipo"
              value={form.tipo}
              onChange={(event) => setForm((prev) => ({ ...prev, tipo: event.target.value.toUpperCase() }))}
              fullWidth
              required
            >
              <MenuItem value="LEVE">LEVE</MenuItem>
              <MenuItem value="PESADO">PESADO</MenuItem>
            </TextField>
            <TextField
              label="Ano"
              type="number"
              value={form.ano}
              onChange={(event) => setForm((prev) => ({ ...prev, ano: event.target.value }))}
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
