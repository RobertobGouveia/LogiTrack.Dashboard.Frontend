import { useEffect, useMemo, useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
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
import type { CreateManutencaoPayload, Manutencao, UpdateManutencaoPayload } from '../../type/manutencao';
import ResponsiveAppBar from '../../components/header/header';
import { MainContainer } from '../dashboard/dashboard.style';

type AppPage = 'dashboard' | 'manutencoes' | 'veiculos' | 'viagens';

type ManutencoesPageProps = {
  onLogout?: () => void;
  onNavigate?: (page: AppPage) => void;
};

type FormState = {
  veiculoId: string;
  dataInicio: string;
  dataFinalizacao: string;
  tipoServico: string;
  custoEstimado: string;
  status: string;
};

const ENDPOINT = '/manutencoes';

const statusOptions = ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'];

const initialForm: FormState = {
  veiculoId: '',
  dataInicio: '',
  dataFinalizacao: '',
  tipoServico: '',
  custoEstimado: '',
  status: 'PENDENTE',
};

function toInputDate(value?: string | null) {
  if (!value) return '';
  return value.slice(0, 10);
}

function toPayload(form: FormState): CreateManutencaoPayload {
  return {
    veiculoId: Number(form.veiculoId),
    dataInicio: form.dataInicio,
    dataFinalizacao: form.dataFinalizacao || undefined,
    tipoServico: form.tipoServico,
    custoEstimado: Number(form.custoEstimado),
    status: form.status,
  };
}

export function ManutencoesPage({ onLogout, onNavigate }: ManutencoesPageProps) {
  const [rows, setRows] = useState<Manutencao[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<Manutencao | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const formTitle = useMemo(() => (editingItem ? 'Editar manutenção' : 'Nova manutenção'), [editingItem]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get<Manutencao[]>(ENDPOINT);
      setRows(response.data || []);
    } catch {
      setError('Nao foi possivel carregar as manutenções. Verifique o backend.');
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

  const openEdit = (item: Manutencao) => {
    setEditingItem(item);
    setForm({
      veiculoId: String(item.veiculoId ?? item.veiculo?.id ?? ''),
      dataInicio: toInputDate(item.dataInicio),
      dataFinalizacao: toInputDate(item.dataFinalizacao),
      tipoServico: item.tipoServico,
      custoEstimado: String(item.custoEstimado),
      status: item.status,
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
    if (!form.veiculoId || !form.dataInicio || !form.tipoServico || !form.custoEstimado || !form.status) {
      setError('Preencha os campos obrigatorios: veiculo, data inicio, tipo, custo e status.');
      return;
    }

    try {
      if (editingItem) {
        const payload: UpdateManutencaoPayload = toPayload(form);
        await api.patch(`${ENDPOINT}/${editingItem.id}`, payload);
        setFeedback('Manutenção atualizada com sucesso.');
      } else {
        await api.post(ENDPOINT, toPayload(form));
        setFeedback('Manutenção criada com sucesso.');
      }

      closeDialog();
      fetchData();
    } catch {
      setError('Erro ao salvar manutenção. Confira os dados e tente novamente.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
      setFeedback('Manutenção excluida com sucesso.');
      fetchData();
    } catch {
      setError('Erro ao excluir manutenção.');
    }
  };

  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;
    await handleDelete(pendingDeleteId);
    closeDeleteDialog();
  };

  return (
    <MainContainer>
      <ResponsiveAppBar onLogout={onLogout} activePage="manutencoes" onNavigate={onNavigate} />

      <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight={700}>Manutenções</Typography>
          </Box>

          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreate}>
            Nova manutenção
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
                <TableCell>Veiculo</TableCell>
                <TableCell>Tipo de servico</TableCell>
                <TableCell>Inicio</TableCell>
                <TableCell>Finalizacao</TableCell>
                <TableCell>Custo estimado</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Acoes</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.veiculo?.placa ?? `ID ${item.veiculoId ?? item.veiculo?.id ?? '-'}`}</TableCell>
                  <TableCell>{item.tipoServico}</TableCell>
                  <TableCell>{new Date(item.dataInicio).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{item.dataFinalizacao ? new Date(item.dataFinalizacao).toLocaleDateString('pt-BR') : '-'}</TableCell>
                  <TableCell>{Number(item.custoEstimado).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                  <TableCell>
                    <Chip size="small" label={item.status} color={item.status === 'CONCLUIDA' ? 'success' : 'warning'} />
                  </TableCell>
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
                      Nenhuma manutenção encontrada.
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
                label="ID do veiculo"
                type="number"
                value={form.veiculoId}
                onChange={(event) => setForm((prev) => ({ ...prev, veiculoId: event.target.value }))}
                fullWidth
                required
              />
            )}
            <TextField
              label="Tipo de servico"
              value={form.tipoServico}
              onChange={(event) => setForm((prev) => ({ ...prev, tipoServico: event.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Data de inicio"
              type="date"
              value={form.dataInicio}
              onChange={(event) => setForm((prev) => ({ ...prev, dataInicio: event.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="Data de finalizacao"
              type="date"
              value={form.dataFinalizacao}
              onChange={(event) => setForm((prev) => ({ ...prev, dataFinalizacao: event.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Custo estimado"
              type="number"
              value={form.custoEstimado}
              onChange={(event) => setForm((prev) => ({ ...prev, custoEstimado: event.target.value }))}
              fullWidth
              required
            />
            <TextField
              select
              label="Status"
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
              fullWidth
            >
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
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
