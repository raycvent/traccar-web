import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import BottomMenu from '../common/components/BottomMenu';

const previewAlerts = [
  {
    id: 1,
    asset: 'Asset 3',
    type: 'Movement detected',
    time: '12 min ago',
    status: 'Active',
  },
  {
    id: 2,
    asset: 'Asset 2',
    type: 'Missed check-in',
    time: 'Earlier today',
    status: 'Review',
  },
];

const AlertsPage = () => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box sx={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          flex: 1,
          width: '100%',
          maxWidth: 900,
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 2.5, sm: 4 },
          boxSizing: 'border-box',
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Alerts
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Items that need attention
        </Typography>

        <Stack spacing={2}>
          {previewAlerts.map((alert) => (
            <Card key={alert.id} variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={2}
                >
                  <Stack direction="row" spacing={1.5}>
                    <WarningAmberIcon color="warning" />

                    <Box>
                      <Typography fontWeight={700}>
                        {alert.asset}
                      </Typography>

                      <Typography>
                        {alert.type}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={0.75}
                        alignItems="center"
                        sx={{ mt: 1 }}
                      >
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {alert.time}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>

                  <Chip
                    label={alert.status}
                    size="small"
                    color={alert.status === 'Active' ? 'warning' : 'default'}
                  />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      {desktop && <BottomMenu />}
    </Box>
  );
};

export default AlertsPage;