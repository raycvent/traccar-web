import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Switch,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RouteIcon from '@mui/icons-material/Route';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import SecurityIcon from '@mui/icons-material/Security';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';

import BottomMenu from '../common/components/BottomMenu';

const activeAlerts = [
  {
    id: 1,
    asset: 'Asset 3',
    type: 'Outside permitted area',
    time: '12 min ago',
    status: 'Active',
  },
  {
    id: 2,
    asset: 'Asset 2',
    type: 'Missed expected check-in',
    time: 'Earlier today',
    status: 'Review',
  },
];

const recentActivity = [
  {
    id: 1,
    asset: 'Asset 1',
    event: 'Check-in received',
    time: '10 min ago',
  },
  {
    id: 2,
    asset: 'Asset 3',
    event: 'Movement recorded',
    time: '26 min ago',
  },
  {
    id: 3,
    asset: 'Asset 4',
    event: 'Location updated',
    time: '1 hr ago',
  },
];

const initialRules = [
  {
    id: 'movement',
    title: 'Movement',
    description: 'Alert only when movement meets configured conditions.',
    enabled: false,
    icon: <RouteIcon />,
  },
  {
    id: 'geofence',
    title: 'Geofence',
    description: 'Alert when an asset breaches a permitted area.',
    enabled: true,
    icon: <LocationOffIcon />,
  },
  {
    id: 'schedule',
    title: 'Schedule',
    description: 'Apply different rules during selected times.',
    enabled: false,
    icon: <ScheduleIcon />,
  },
  {
    id: 'checkin',
    title: 'Missed check-in',
    description: 'Alert when an expected report is not received.',
    enabled: true,
    icon: <SyncProblemIcon />,
  },
  {
    id: 'tamper',
    title: 'Tamper',
    description: 'Alert when supported hardware reports interference.',
    enabled: true,
    icon: <SecurityIcon />,
  },
  {
    id: 'battery',
    title: 'Battery / power',
    description: 'Alert when supported hardware reports a power issue.',
    enabled: true,
    icon: <BatteryAlertIcon />,
  },
];

const AlertsPage = () => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  const [tab, setTab] = useState(0);
  const [rules, setRules] = useState(initialRules);

  const toggleRule = (id) => {
    setRules((current) =>
      current.map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule,
      ),
    );
  };

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

        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Exceptions and activity that matter
        </Typography>

        <Tabs
          value={tab}
          onChange={(event, value) => setTab(value)}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Active" />
          <Tab label="Activity" />
          <Tab label="Rules" />
        </Tabs>

        {tab === 0 && (
          <Stack spacing={2}>
            {activeAlerts.map((alert) => (
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
        )}

        {tab === 1 && (
          <Stack spacing={2}>
            {recentActivity.map((item) => (
              <Card key={item.id} variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography fontWeight={700}>
                    {item.asset}
                  </Typography>

                  <Typography>
                    {item.event}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.75 }}
                  >
                    {item.time}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        {tab === 2 && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Rules can be configured per asset. Movement alone does not have to
              create an alert.
            </Typography>

            <Stack spacing={2}>
              {rules.map((rule) => (
                <Card key={rule.id} variant="outlined" sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                    >
                      <Box sx={{ display: 'flex', color: 'text.secondary' }}>
                        {rule.icon}
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={700}>
                          {rule.title}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {rule.description}
                        </Typography>
                      </Box>

                      <Switch
                        checked={rule.enabled}
                        onChange={() => toggleRule(rule.id)}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 2 }}
            >
              Preview only — rule changes are not saved yet.
            </Typography>
          </>
        )}
      </Box>

      {desktop && <BottomMenu />}
    </Box>
  );
};

export default AlertsPage;