import { useState } from 'react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Link,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { Link as RouterLink } from 'react-router-dom';
// ----------------------------------------------------------------------

export default function AuthLoginForm() {
  const { login, fakeLogin } = useAuthContext();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    try {
      if (
        data.email == process.env.REACT_APP_EMAIL &&
        data.password == process.env.REACT_APP_PASSWORD
      ) {
        await fakeLogin();
      } else {
        await login(data.email, data.password);
      }
    } catch (error) {
      console.error(error);

      reset();

      setError('afterSubmit', {
        ...error,
        message: error.message,
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify
                    icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                    color="warning.main"
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ my: 2 }}>
        <FormControlLabel
          control={<Checkbox defaultChecked color="warning" />}
          label="Remember me"
        />
        <Link variant="body2" color="warning.main" underline="always">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        color="warning"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitSuccessful || isSubmitting}
        sx={{
          // bgcolor: 'text.primary',
          color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          '&:hover': {
            bgcolor: 'warning.main',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          },
        }}
      >
        Login
      </LoadingButton>
      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitSuccessful || isSubmitting}
        sx={{
          mt: 2,
          bgcolor: 'text.primary',
          color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          '&:hover': {
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          },
        }}
      >
        Sign in with Gmail
      </LoadingButton>
      <Stack direction="row" justifyContent="center" spacing={1} mt={1}>
        <Typography variant="body2" color="text.secondary">
          Don't have an account?
        </Typography>
        <Link onClick={() => window.open("https://www.tg-investment.com/auth/register", '_blank').focus()} rel="noreferrer" component={RouterLink} variant="body2" color="warning.main">
          Register here
        </Link>
      </Stack>
    </FormProvider>
  );
}