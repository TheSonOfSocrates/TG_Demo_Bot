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
import { useSnackbar } from '../components/snackbar';
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

export default function KeyInputDlg(props) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const { sendKey2Server, isKeyInputted } = useAuthContext();

  const [apiKey, setApiKey] = useState('');
  const [secret, setSecret] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const setKeyWithOption = () => {
    const result = sendKey2Server({ apiKey, secret });
    if (result) {
      enqueueSnackbar('Key saved successfully.');
    } else {
      enqueueSnackbar('Key wasn\'t saved.');
    }
  };

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const handleSecretChange = (e) => {
    setSecret(e.target.value);
  };

  const handleClickShowApiKey = () => setShowApiKey((show) => !show);

  const handleClickShowSecret = () => setShowSecret((show) => !show);

  const handleMouseDown = (event) => {
    event.preventDefault();
  };

  const handleKeyInputDlgClose = () => {
    setShowApiKey(false);
    setShowSecret(false);
    props.handleKeyInputDlgOpenClose();
  };

  return (
    <Modal
      open={props.keyInputDlgOpen}
      onClose={handleKeyInputDlgClose}>
      <Box sx={modalStyle}>
        <DialogTitle id='draggable-dialog-title'>
          {'ApiKey & Secret ' + (isKeyInputted ? '(Inputted)' : '(Not Inputted)')}
        </DialogTitle>
        <DialogContent>
          {!isKeyInputted &&
            <Alert severity='info'>{`Api key and secret is used only once and then deleted immediately.`}</Alert>}
          {isKeyInputted && <Alert severity='success'>{`You already set your api key & secret.`}</Alert>}
          <>
            <FormControl sx={{ m: 1, mt: 3, width: '100%' }} variant='standard'>
              <InputLabel htmlFor='standard-adornment-password'>Api key</InputLabel>
              <Input
                type={showApiKey ? 'text' : 'password'}
                onChange={handleApiKeyChange}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={handleClickShowApiKey}
                      onMouseDown={handleMouseDown}
                    >
                      {showApiKey ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl sx={{ m: 1, mt: 3, width: '100%' }} variant='standard'>
              <InputLabel htmlFor='standard-adornment-password'>Secret</InputLabel>
              <Input
                type={showSecret ? 'text' : 'password'}
                onChange={handleSecretChange}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={handleClickShowSecret}
                      onMouseDown={handleMouseDown}
                    >
                      {showSecret ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={setKeyWithOption} disabled={isKeyInputted}>
            Save
          </Button>
          <Button autoFocus onClick={handleKeyInputDlgClose}>
            Close
          </Button>
        </DialogActions>
      </Box>
    </Modal>
  );
}