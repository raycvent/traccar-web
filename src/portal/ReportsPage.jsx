import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HistoryIcon from '@mui/icons-material/History';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SummarizeIcon from '@mui/icons-material/Summarize';

import BottomMenu from '../common/components/BottomMenu';

const reportTypes = [
  {
    title: 'Incident Report',
    description: 'Location, movement and alerts for a selected incident period.',
    icon: <DescriptionOutlinedIcon />,
  },
  {
    title: 'Asset History',
    description: 'Review check-ins and movement over a selected period.',
    icon: <HistoryIcon />,
  },
  {
    title: 'Alert History',
    description: 'Review alerts and exceptions for an asset.',
    icon: <NotificationsNoneIcon />,
  },
  {
    title: 'Period Summary',
    description: 'Simple overview of asset activity and status.',
    icon: <SummarizeIcon />,
  },
];

const ReportsPage = () => {
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
          Reports
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Clear history when you need it
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
            },
            gap: 2,
          }}
        >
          {reportTypes.map((report) => (
            <Card
              key={report.title}
              variant="outlined"
              sx={{ borderRadius: 3 }}
            >
              <CardContent>
                <Stack spacing={1.5}>
                  {report.icon}

                  <Typography variant="h6" fontWeight={700}>
                    {report.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {report.description}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {desktop && <BottomMenu />}
    </Box>
  );
};

export default ReportsPage;