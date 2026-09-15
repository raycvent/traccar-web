import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Badge,
} from '@mui/material';

import MapIcon from '@mui/icons-material/Map';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DescriptionIcon from '@mui/icons-material/Description';

const BottomMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const socket = useSelector((state) => state.session.socket);

  const currentSelection = () => {
    if (location.pathname === '/') return 'map';
    if (location.pathname.startsWith('/assets')) return 'assets';
    if (location.pathname.startsWith('/alerts')) return 'alerts';
    if (location.pathname.startsWith('/reports')) return 'reports';

    return null;
  };

  const handleSelection = (event, value) => {
    switch (value) {
      case 'map':
        navigate('/');
        break;

      case 'assets':
        navigate('/assets');
        break;

      case 'alerts':
        navigate('/alerts');
        break;

      case 'reports':
        navigate('/reports');
        break;

      default:
        break;
    }
  };

  return (
    <Paper square elevation={3}>
      <BottomNavigation
        value={currentSelection()}
        onChange={handleSelection}
        showLabels
      >
        <BottomNavigationAction
          label="Map"
          value="map"
          icon={
            <Badge
              color="error"
              variant="dot"
              overlap="circular"
              invisible={socket !== false}
            >
              <MapIcon />
            </Badge>
          }
        />

        <BottomNavigationAction
          label="Assets"
          value="assets"
          icon={<Inventory2Icon />}
        />

        <BottomNavigationAction
          label="Alerts"
          value="alerts"
          icon={<NotificationsActiveIcon />}
        />

        <BottomNavigationAction
          label="Reports"
          value="reports"
          icon={<DescriptionIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomMenu;