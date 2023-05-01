import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem } from '@mui/material';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components
import { CustomAvatar } from '../../../components/custom-avatar';
import { useSnackbar } from '../../../components/snackbar';
import MenuPopover from '../../../components/menu-popover';
import { IconButtonAnimate } from '../../../components/animate';
import LicenseMngDlg from 'sections/LicenseMngDlg';
import DBConfigDlg from '../../../sections/DBConfigDlg';

// ----------------------------------------------------------------------

const OPTIONS = [
  {
    label: 'Home',
    linkTo: '/',
  },
  {
    label: 'Profile',
    linkTo: '/',
  },
  {
    label: 'Settings',
    linkTo: '/',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();

  const { user, logout, getLicenseKey, getConnectionStatus } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const [openPopover, setOpenPopover] = useState(null);
  const [licenseMngDlgOpen, setLicenseMngDlgOpen] = useState(false);
  const [dbConfigDlgOpen, setDbConfigDlgOpen] = useState(false);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  useEffect(() => {
    getConnectionStatus();
    getLicenseKey();
  }, []);

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleLogout = async () => {
    try {
      logout();
      navigate(PATH_AUTH.login, { replace: true });
      handleClosePopover();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  const handleLicenseManagement = async () => {
      setLicenseMngDlgOpen(true);
      handleClosePopover();
  };

  const handleDBConfiguration = async () => {
    setDbConfigDlgOpen(true);
    handleClosePopover();
  };

  const handleLicenseMngDlgClose = async () => {
      setLicenseMngDlgOpen(false);
  };

  const handleDbConfigDlgOpenClose = async () => {
    setDbConfigDlgOpen(false);
  };

  const handleClickItem = (path) => {
    handleClosePopover();
    navigate(path);
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpenPopover}
        sx={{
          p: 0,
          ...(openPopover && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <CustomAvatar src="/avatar_15.jpg" alt={user?.displayName} name={user?.displayName} />
      </IconButtonAnimate>

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 200, p: 0 }}>
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.name}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
              {option.label}
            </MenuItem>
          ))}
        </Stack> */}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLicenseManagement} sx={{ m: 1 }}>
          License Management
        </MenuItem>

        <MenuItem onClick={handleDBConfiguration} sx={{ m: 1 }}>
          DB Configuration
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>

      <LicenseMngDlg licenseMngDlgOpen={licenseMngDlgOpen} handleLicenseMngDlgClose={handleLicenseMngDlgClose}></LicenseMngDlg>
      <DBConfigDlg dbConfigDlgOpen={dbConfigDlgOpen} handleDbConfigDlgOpenClose={handleDbConfigDlgOpenClose}></DBConfigDlg>
    </>
  );
}
