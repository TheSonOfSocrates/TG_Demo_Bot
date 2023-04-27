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

export default function LicenseMngDlg(props) {
  const [showLicenseKey, setShowLicenseKey] = useState(false);
  const { licenseKey, isValidLicenseKey, remains, changeLicenseKey, checkLicenseKey } = useAuthContext();

  const handleClickShowLicenseKey = () => setShowLicenseKey((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLicenseKeyChange = (e) => {
    changeLicenseKey(e.target.value);
  }

  const handleLicenseMngDlgClose = () => {
    setShowLicenseKey(false);
    props.handleLicenseMngDlgClose();
  }

  const handleCheckLicenseKey = () => {
    checkLicenseKey(licenseKey);
  }

  return (
    <Modal
    open={props.licenseMngDlgOpen}
    onClose={handleLicenseMngDlgClose}>
    <Box sx={modalStyle}>
      <DialogTitle id='draggable-dialog-title'>
        {'Welcome'}
      </DialogTitle>
      <DialogContent>
        {isValidLicenseKey && <Alert severity='success'>{`Your license key is valid. (${remains} days remained.)`}</Alert>}
        {!isValidLicenseKey && <Alert severity='error'>Your license key isn't valid.</Alert>}
        <>
          <FormControl sx={{ m: 1, mt: 3, width: '100%' }} variant="standard">
            <InputLabel htmlFor="standard-adornment-password">LicenseKey</InputLabel>
            <Input
              id="standard-adornment-password"
              type={showLicenseKey ? 'text' : 'password'}
              onChange={handleLicenseKeyChange}
              value={licenseKey}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowLicenseKey}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showLicenseKey ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </>
      </DialogContent>
      <DialogActions>
          <Button onClick={handleCheckLicenseKey}>
            Validate LicenseKey
          </Button>
          <Button autoFocus onClick={handleLicenseMngDlgClose}>
            Close
          </Button>
      </DialogActions>
    </Box>
  </Modal>
  );
}