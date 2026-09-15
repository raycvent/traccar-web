import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Button,
  ButtonBase,
  Chip,
  Divider,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { devicesActions } from '../store';
import useFilter from './useFilter';
import DemoAssetMarkers from './DemoAssetMarkers';
import { map } from '../map/core/MapView';

const MainMap = lazy(() => import('./MainMap'));

const sections = [
  'Notifications',
  'History',
  'Profile',
  'Settings',
  'Geofencing',
  'Device Info',
];

const profiles = [
  'Daily',
  'Weekly',
  'Parking',
  'Live',
  'Emergency',
];

const MainPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  const positions = useSelector((state) => state.session.positions);
  const reduxSelectedId = useSelector((state) => state.devices.selectedId);

  const [filteredDevices, setFilteredDevices] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);

  const [selectedAssetKey, setSelectedAssetKey] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [section, setSection] = useState(0);
  const [profile, setProfile] = useState('Daily');

  useFilter(
    '',
    {
      statuses: [],
      groups: [],
      geofences: [],
    },
    '',
    false,
    positions,
    setFilteredDevices,
    setFilteredPositions,
  );

  const assets = useMemo(() => {
    if (filteredDevices.length) {
      return filteredDevices.map((device) => ({
        ...device,
        key: String(device.id),
        placeholder: false,
      }));
    }

    return [
      {
        id: 'asset-1',
        key: 'asset-1',
        name: 'Asset 1',
        placeholder: true,
        status: 'Online',
        reportStatus: 'Reported today',
        lastUpdate: '2026-09-15T10:15:00',
        uniqueId: 'RV-000001',
        latitude: 13.7563,
        longitude: 100.5018,
      },
      {
        id: 'asset-2',
        key: 'asset-2',
        name: 'Asset 2',
        placeholder: true,
        status: 'Online',
        reportStatus: 'Reported today',
        lastUpdate: '2026-09-15T09:48:00',
        uniqueId: 'RV-000002',
        latitude: 16.4322,
        longitude: 102.8236,
      },
      {
        id: 'asset-3',
        key: 'asset-3',
        name: 'Asset 3',
        placeholder: true,
        status: 'Offline',
        reportStatus: 'Needs attention',
        lastUpdate: '2026-09-14T16:32:00',
        uniqueId: 'RV-000003',
        latitude: 12.9236,
        longitude: 100.8825,
      },
    ];
  }, [filteredDevices]);

  const selectedAsset = assets.find(
    (asset) => asset.key === selectedAssetKey,
  );

  const selectedPosition = filteredPositions.find(
    (position) =>
      reduxSelectedId &&
      position.deviceId === reduxSelectedId,
  );

  useEffect(() => {
    if (reduxSelectedId) {
      const match = filteredDevices.find(
        (device) => device.id === reduxSelectedId,
      );

      if (match) {
        setSelectedAssetKey(String(match.id));
        setPanelOpen(true);
      }
    }
  }, [reduxSelectedId, filteredDevices]);

  const selectAsset = (asset, tabIndex = 1) => {
    setSelectedAssetKey(asset.key);
    setSection(tabIndex);
    setPanelOpen(true);

    if (asset.placeholder) {
      dispatch(devicesActions.selectId(null));

      if (
        Number.isFinite(asset.latitude) &&
        Number.isFinite(asset.longitude)
      ) {
        map.flyTo({
          center: [asset.longitude, asset.latitude],
          zoom: 14,
          duration: 900,
        });
      }
    } else {
      dispatch(devicesActions.selectId(asset.id));
    }
  };

  const openSection = (tabIndex) => {
    const asset = selectedAsset || assets[0];

    if (asset) {
      selectAsset(asset, tabIndex);
    }
  };

  const closePanel = () => {
    setPanelOpen(false);
    setSelectedAssetKey(null);
    dispatch(devicesActions.selectId(null));
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        bgcolor: '#07121f',
      }}
    >
      {/* MAP IS THE PERMANENT APP SURFACE */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
        }}
      >
        <Suspense fallback={null}>
          <MainMap
            filteredPositions={filteredPositions}
            selectedPosition={selectedPosition}
            onEventsClick={() => {}}
          />
        </Suspense>

        <DemoAssetMarkers
          assets={assets}
          selectedAssetKey={selectedAssetKey}
          onSelect={selectAsset}
        />
      </Box>

      {/* TOP APP BAR */}
      <Paper
        square
        elevation={6}
        sx={{
          position: 'absolute',
          zIndex: 20,
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'rgba(8, 20, 34, 0.96)',
          color: '#fff',
        }}
      >
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: 0.5,
          }}
        >
          REMOTE-VUE
        </Typography>

        <Box sx={{ flex: 1 }} />

        <Button
          size="small"
          onClick={() => {
            setPanelOpen(false);
            setSelectedAssetKey(null);
            dispatch(devicesActions.selectId(null));
          }}
          sx={{
            color: '#fff',
            textTransform: 'none',
          }}
        >
          Map
        </Button>
      </Paper>

      {/* ASSET SELECTOR */}
      <Paper
        elevation={5}
        sx={{
          position: 'absolute',
          zIndex: 15,
          left: desktop ? 18 : 10,
          right: desktop ? 'auto' : 10,
          bottom: 78,
          width: desktop ? 370 : 'auto',
          px: 1.25,
          py: 1,
          borderRadius: 3,
          bgcolor: 'rgba(8, 20, 34, 0.94)',
          color: '#fff',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mb: 0.75,
            opacity: 0.7,
          }}
        >
          Assets
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            overflowX: 'auto',
            pb: 0.25,
          }}
        >
          {assets.map((asset) => (
            <ButtonBase
              key={asset.key}
              onClick={() => selectAsset(asset)}
              sx={{
                minWidth: 96,
                px: 1.5,
                py: 1,
                borderRadius: 2,
                bgcolor:
                  selectedAssetKey === asset.key
                    ? 'rgba(255,255,255,0.16)'
                    : 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                textAlign: 'left',
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 14,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {asset.name}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: asset.placeholder
                      ? 'rgba(255,255,255,0.55)'
                      : '#70e29a',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {asset.reportStatus || 'Connected'}
                </Typography>
              </Box>
            </ButtonBase>
          ))}
        </Stack>
      </Paper>

      {/* FIXED APP BOTTOM BAR */}
      <Paper
        square
        elevation={8}
        sx={{
          position: 'absolute',
          zIndex: 20,
          left: 0,
          right: 0,
          bottom: 0,
          height: 66,
          bgcolor: 'rgba(8, 20, 34, 0.98)',
          color: '#fff',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
        }}
      >
        <ButtonBase
          onClick={() => {
            setPanelOpen(false);
            setSelectedAssetKey(null);
          }}
          sx={{ color: '#fff' }}
        >
          <Typography variant="body2">
            Map
          </Typography>
        </ButtonBase>

        <ButtonBase
          onClick={() => openSection(1)}
          sx={{ color: '#fff' }}
        >
          <Typography variant="body2">
            History
          </Typography>
        </ButtonBase>

        <ButtonBase
          onClick={() => openSection(2)}
          sx={{ color: '#fff' }}
        >
          <Typography variant="body2">
            Profile
          </Typography>
        </ButtonBase>

        <ButtonBase
          onClick={() => openSection(3)}
          sx={{ color: '#fff' }}
        >
          <Typography variant="body2">
            Settings
          </Typography>
        </ButtonBase>
      </Paper>

      {/* SELECTED ASSET PANEL */}
      {panelOpen && selectedAsset && (
        <Paper
          elevation={12}
          sx={{
            position: 'absolute',
            zIndex: 30,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',

            ...(desktop
              ? {
                  top: 82,
                  left: 18,
                  bottom: 82,
                  width: 460,
                  borderRadius: 3,
                }
              : {
                  top: 118,
                  left: 8,
                  right: 8,
                  bottom: 74,
                  borderRadius: '18px 18px 10px 10px',
                }),
          }}
        >
          {/* ASSET HEADER */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#0d1b2a',
              color: '#fff',
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                fontWeight={800}
                noWrap
              >
                {selectedAsset.name}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  opacity: 0.7,
                }}
              >
                {selectedAsset.lastUpdate
                  ? `Last report ${new Date(
                      selectedAsset.lastUpdate,
                    ).toLocaleString()}`
                  : 'No report received'}
              </Typography>
            </Box>

            <Button
              size="small"
              onClick={closePanel}
              sx={{
                color: '#fff',
                textTransform: 'none',
              }}
            >
              Close
            </Button>
          </Box>

          {/* CP-STYLE INTERNAL SECTIONS */}
          <Tabs
            value={section}
            onChange={(event, value) => setSection(value)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 46,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            {sections.map((item) => (
              <Tab
                key={item}
                label={item}
                sx={{
                  minHeight: 46,
                  textTransform: 'none',
                  fontSize: 12,
                }}
              />
            ))}
          </Tabs>

          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
            }}
          >
            {/* NOTIFICATIONS */}
            {section === 0 && (
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    Notifications
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Notification preferences for this asset.
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography fontWeight={700} sx={{ mb: 1 }}>
                    Schedule
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(
                      (day, index) => (
                        <Chip
                          key={`${day}-${index}`}
                          label={day}
                          variant={index < 5 ? 'filled' : 'outlined'}
                        />
                      ),
                    )}
                  </Stack>
                </Box>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                >
                  <TextField
                    label="From"
                    value="07:30"
                    size="small"
                    fullWidth
                  />

                  <TextField
                    label="To"
                    value="23:00"
                    size="small"
                    fullWidth
                  />
                </Stack>

                <Divider />

                <Box>
                  <Typography fontWeight={700} sx={{ mb: 1 }}>
                    Channels
                  </Typography>

                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Push notifications"
                  />

                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Email notifications"
                  />
                </Box>
              </Stack>
            )}

            {/* HISTORY */}
            {section === 1 && (
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={800}>
                  History
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Typography fontWeight={700}>
                    Latest report
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.75 }}
                  >
                    {selectedAsset.lastUpdate
                      ? new Date(
                          selectedAsset.lastUpdate,
                        ).toLocaleString()
                      : 'No report received'}
                  </Typography>
                </Paper>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Historical reports will appear here in date and time order.
                </Typography>
              </Stack>
            )}

            {/* PROFILE */}
            {section === 2 && (
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    Profile
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Select how this asset reports.
                  </Typography>
                </Box>

                <Stack spacing={1}>
                  {profiles.map((item) => (
                    <Button
                      key={item}
                      variant={
                        profile === item
                          ? 'contained'
                          : 'outlined'
                      }
                      onClick={() => setProfile(item)}
                      fullWidth
                      sx={{
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        py: 1.2,
                      }}
                    >
                      {item}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            )}

            {/* SETTINGS */}
            {section === 3 && (
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={800}>
                  Settings
                </Typography>

                <TextField
                  label="Asset name"
                  value={selectedAsset.name}
                  size="small"
                  fullWidth
                />

                <TextField
                  select
                  label="Units"
                  value="metric"
                  size="small"
                  fullWidth
                >
                  <MenuItem value="metric">
                    Metric
                  </MenuItem>

                  <MenuItem value="imperial">
                    Imperial
                  </MenuItem>
                </TextField>
              </Stack>
            )}

            {/* GEOFENCING */}
            {section === 4 && (
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={800}>
                  Geofencing
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Typography fontWeight={700}>
                    No geofence configured
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.75 }}
                  >
                    Geofences for this asset will be managed here.
                  </Typography>
                </Paper>

                <Button
                  variant="contained"
                  disabled
                  sx={{ textTransform: 'none' }}
                >
                  New Geofence
                </Button>
              </Stack>
            )}

            {/* DEVICE INFO */}
            {section === 5 && (
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={800}>
                  Device Info
                </Typography>

                <Stack spacing={1.5}>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Device status
                    </Typography>

                    <Typography fontWeight={700}>
                      {selectedAsset.status || 'Unknown'}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Last report
                    </Typography>

                    <Typography fontWeight={700}>
                      {selectedAsset.lastUpdate
                        ? new Date(
                            selectedAsset.lastUpdate,
                          ).toLocaleString()
                        : 'Not reported'}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Identifier
                    </Typography>

                    <Typography fontWeight={700}>
                      {selectedAsset.uniqueId || '—'}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default MainPage;