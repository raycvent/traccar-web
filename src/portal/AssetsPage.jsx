import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import BottomMenu from '../common/components/BottomMenu';

const previewAssets = [
  { id: 1, name: 'Asset 1', status: 'Safe', lastUpdate: '10 min ago', location: 'Last location available' },
  { id: 2, name: 'Asset 2', status: 'Safe', lastUpdate: '22 min ago', location: 'Last location available' },
  { id: 3, name: 'Asset 3', status: 'Attention', lastUpdate: '1 hr ago', location: 'Last location available' },
  { id: 4, name: 'Asset 4', status: 'Safe', lastUpdate: 'Today', location: 'Last location available' },
];

const AssetsPage = () => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const devices = useSelector((state) => state.devices.items);
  const [search, setSearch] = useState('');

  const realAssets = Object.values(devices || {}).map((device, index) => ({
    id: device.id,
    name: device.name || `Asset ${index + 1}`,
    status: device.status === 'online' ? 'Safe' : device.status === 'offline' ? 'Offline' : 'Unknown',
    lastUpdate: device.lastUpdate
      ? new Date(device.lastUpdate).toLocaleString()
      : 'Not reported',
    location: device.positionId ? 'Last location available' : 'No location yet',
  }));

  const assets = realAssets.length ? realAssets : previewAssets;

  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Box sx={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          flex: 1,
          width: '100%',
          maxWidth: 1000,
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 2.5, sm: 4 },
          boxSizing: 'border-box',
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Assets
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {assets.length} assets
        </Typography>

        <TextField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search assets"
          size="small"
          fullWidth
          sx={{ maxWidth: 480, mb: 3 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 2,
          }}
        >
          {filteredAssets.map((asset) => (
            <Card key={asset.id} variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h6" fontWeight={700}>
                    {asset.name}
                  </Typography>

                  <Chip
                    label={asset.status}
                    color={asset.status === 'Safe' ? 'success' : 'default'}
                    size="small"
                  />
                </Stack>

                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Last check-in
                      </Typography>
                      <Typography variant="body2">{asset.lastUpdate}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <LocationOnOutlinedIcon fontSize="small" color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body2">{asset.location}</Typography>
                    </Box>
                  </Stack>
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

export default AssetsPage;