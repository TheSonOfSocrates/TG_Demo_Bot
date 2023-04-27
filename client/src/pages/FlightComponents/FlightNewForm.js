import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'redux/store';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  InputAdornment,
  Button,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// assets
import { pairs, cryptos } from '../../assets/data';
// components
import Iconify from 'components/iconify';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFAutocomplete,
  RHFCheckbox,
} from '../../components/hook-form';
import useBinancePrice from 'hooks/useBinancePrice';
import useSpotBalance from 'hooks/useSpotBalance';
import { createFlight } from 'redux/slices/flight';
import SymbolAvatar from 'components/SymbolAvatar';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
// ----------------------------------------------------------------------

FlightNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentFlight: PropTypes.object,
};


export default function FlightNewForm({ isEdit = false, currentFlight }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [percent, setPercent] = useState(false);
  const [amountAsset, setAmountAsset] = useState(true);

  const { enqueueSnackbar } = useSnackbar();

  const NewFlightSchema = Yup.object().shape({
    startPosition: Yup.string().required('Start Position is required'),
    // email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    // phoneNumber: Yup.string().required('Phone number is required'),
    // address: Yup.string().required('Address is required'),
  });

  const defaultValues = useMemo(
    () => ({
      pair: currentFlight?.pair || pairs[0],
      startPosition: currentFlight?.startPosition || '',
      stepInterval: currentFlight?.stepInterval || 20,
      stepAmount: currentFlight?.stepAmount || 0.001,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentFlight]
  );

  const methods = useForm({
    resolver: yupResolver(NewFlightSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const price = useBinancePrice(values?.pair?.symbol);
  const balance = useSpotBalance(values?.pair?.baseAsset, values?.pair?.quoteAsset);
  console.log('balance===>', balance);
  useEffect(() => {
    // if (isEdit && currentFlight) {
    //   reset(defaultValues);
    // }
    // if (!isEdit) {
    //   reset(defaultValues);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentFlight]);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const createData = {
        ...data,
        startPosition: Number(data.startPosition),
        stepInterval: Number(data.stepInterval),
        stepAmount: Number(data.stepAmount),
        amountAsset: amountAsset ? data.pair.baseAsset : data.pair.quoteAsset,
      };
      // await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch(createFlight(createData));
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.flight.list);
    } catch (error) {
      console.error(error);
    }
  };
  // const temp = pairs.map((pair) => {
  //   const object = {
  //     fee: 0.1,
  //     ...pair,
  //   };
  //   return object;
  // });
  // console.log(temp);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
     
      <Card sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item md={6}>
            <Stack spacing={2}>
              <RHFAutocomplete
                name="pair"
                label="Pair"
                autoHighlight
                options={pairs}
                getOptionLabel={(option) => option.symbol}
                isOptionEqualToValue={(option, value) => option.symbol === value.symbol}
              />
              {values.pair && (
                <Stack spacing={2}>
                  <RHFTextField type="number" name="startPosition" label="Start Position" />

                  <Stack direction="row" alignItems="center" spacing={2}>
                    <RHFTextField
                      name="stepInterval"
                      label="Step Interval"
                      type="number"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              variant={percent ? 'contained' : 'outlined'}
                              color={percent ? 'primary' : 'inherit'}
                              onClick={() => setPercent(!percent)}
                            >
                              <Iconify icon="mdi:percent-outline" />
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                    />

                  </Stack>
                  <RHFTextField
                    type="number"
                    name="stepAmount"
                    label="Step Amount"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setAmountAsset(!amountAsset)}
                          >
                            {amountAsset ? values.pair.baseAsset : values.pair.quoteAsset}
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              )}
            </Stack>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={2}
              sx={{ mt: 3 }}
            >
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.flight.list}
                color="error"
              >
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Flight' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Grid>

          <Grid item md={6}>
            {values.pair && (
              <Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{ width: 1, p: 3, bgcolor: '#ffffff10', borderRadius: 2 }}
                  spacing={3}
                >
                  {values.pair.symbol && (
                    <SymbolAvatar pair={values.pair} size="large" width={60} />
                  )}
                  <Stack>
                    <Typography color="text.disabled">{values.pair.symbol}</Typography>
                    <Typography variant="h3">{price}</Typography>
                  </Stack>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{ width: 1, p: 3, bgcolor: '#ffffff10', borderRadius: 2, mt: 3 }}
                  spacing={3}
                >
                  <Grid container spacing={2}>
                    <Grid item md={4}>
                      <Stack sx={{ px: 3, borderLeft: '2px solid #00AB55' }} spacing={1}>
                        <Typography color="text.disabled">Start Position:</Typography>
                        <Typography variant="h5">{values.startPosition}</Typography>
                      </Stack>
                    </Grid>
                    
                    <Grid item md={4}>
                      <Stack sx={{ px: 3, borderLeft: '2px solid #00AB55' }} spacing={1}>
                        <Typography color="text.disabled">Step Amount:</Typography>
                        <Typography variant="h5">
                          {values.stepAmount}{' '}
                          {amountAsset ? values.pair.baseAsset : values.pair.quoteAsset}
                        </Typography>
                      </Stack>
                    </Grid>
                   
                    <Grid item md={4}>
                      <Stack sx={{ px: 3, borderLeft: '2px solid #00AB55' }} spacing={1}>
                        <Typography color="text.disabled">Spot Balance:</Typography>
                        <Typography variant="h5">
                          {balance?.baseAsset?.free.toFixed(4)} {values.pair.baseAsset}

                        </Typography>
                        <Typography variant="h5">
                          {balance?.quoteAsset?.free.toFixed(4)} {values.pair.quoteAsset}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Stack>
            )}
          </Grid>
        </Grid>
      </Card>
    </FormProvider>
  );
}
