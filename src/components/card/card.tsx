import CardMui from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

type Props = {
  title: string;
  value: string | number;
  extra?: string | number;
  subtitle?: string;
};

export function Card({ title, value, extra, subtitle }: Props) {
  return (
    <CardMui elevation={3} sx={{ borderRadius: 2, minHeight: 150, bgcolor: 'background.paper' }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          {extra && (
            <Typography variant="caption" color="primary" fontWeight={600}>
              {extra}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </CardMui>
  );
}