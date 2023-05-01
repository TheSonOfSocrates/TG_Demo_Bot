// @mui
import { useTheme } from '@mui/material/styles';
import {
  Alert,
  Box,
  Button,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Modal from '@mui/material/Modal';
import DialogActions from '@mui/material/DialogActions';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

// auth
import { useAuthContext } from '../auth/useAuthContext';

// hooks
import { useEffect, useState } from 'react';

// icons
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
// ----------------------------------------------------------------------

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #15b3b2',
  borderRadius: 3,
  boxShadow: 24,
  p: 2,
};

// ----------------------------------------------------------------------

export default function DBConfigDlg(props) {
  const [showDBUrl, setShowDBUrl] = useState(false);
  const [showDBUsername, setShowDBUsername] = useState(false);
  const [showDBPassword, setShowDBPassword] = useState(false);
  const { connectDB, isConnected } = useAuthContext();

  const [dbUrl, setDbUrl] = useState('');
  const [dbUserName, setDbUserName] = useState('');
  const [dbPassword, setDbPassword] = useState('');

  const connectDBWithOption = () => {
    connectDB({ dbUrl, dbUserName, dbPassword });
  };

  const handleDBUrlChange = (e) => {
    setDbUrl(e.target.value);
  };

  const handleDBUsernameChange = (e) => {
    setDbUserName(e.target.value);
  };

  const handleDBPasswordChange = (e) => {
    setDbPassword(e.target.value);
  };

  const handleClickShowDBUrl = () => setShowDBUrl((show) => !show);

  const handleClickShowDBUsername = () => setShowDBUsername((show) => !show);

  const handleClickShowDBPassword = () => setShowDBPassword((show) => !show);

  const handleMouseDown = (event) => {
    event.preventDefault();
  };

  const handleDBConfigDlgClose = () => {
    setShowDBUrl(false);
    setShowDBUsername(false);
    setShowDBPassword(false);
    props.handleDbConfigDlgOpenClose();
  };

  return (
    <Modal
      open={props.dbConfigDlgOpen}
      onClose={handleDBConfigDlgClose}>
      <Box sx={modalStyle}>
        <DialogTitle id='draggable-dialog-title'>
          {'Database Configuration ' + (isConnected ? '(Connected)' : '(Not connected)')}
        </DialogTitle>
        <DialogContent>
          {!isConnected &&
            <Alert severity='info'>{`DB configuration is used only once and then deleted immediately.`}</Alert>}
          {isConnected && <Alert severity='success'>{`You already connected to your own database.`}</Alert>}
          <>
            <FormControl sx={{ m: 1, mt: 3, width: '100%' }} variant='standard'>
              <InputLabel htmlFor='standard-adornment-password'>DB URL</InputLabel>
              <Input
                type={showDBUrl ? 'text' : 'password'}
                onChange={handleDBUrlChange}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={handleClickShowDBUrl}
                      onMouseDown={handleMouseDown}
                    >
                      {showDBUrl ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl sx={{ m: 1, mt: 3, width: '100%' }} variant='standard'>
              <InputLabel htmlFor='standard-adornment-password'>DB USERNAME</InputLabel>
              <Input
                type={showDBUsername ? 'text' : 'password'}
                onChange={handleDBUsernameChange}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={handleClickShowDBUsername}
                      onMouseDown={handleMouseDown}
                    >
                      {showDBUsername ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl sx={{ m: 1, mt: 3, width: '100%' }} variant='standard'>
              <InputLabel htmlFor='standard-adornment-password'>DB PASSWORD</InputLabel>
              <Input
                type={showDBPassword ? 'text' : 'password'}
                onChange={handleDBPasswordChange}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={handleClickShowDBPassword}
                      onMouseDown={handleMouseDown}
                    >
                      {showDBPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={connectDBWithOption} disabled={isConnected}>
            Connect
          </Button>
          <Button autoFocus onClick={handleDBConfigDlgClose}>
            Cancel
          </Button>
        </DialogActions>
      </Box>
    </Modal>
  );
}