import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
// @mui
import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  Box,
  Typography,
  Stack,
  Grid,
  Paper,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from 'routes/paths';
// _mock_
// import { _userList } from '_mock/arrays';
// components
import Iconify from 'components/iconify';
import Scrollbar from 'components/scrollbar';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { useSettingsContext } from 'components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'components/table';
import { useDispatch, useSelector } from 'redux/store';
import { getFlight } from 'redux/slices/flight';
// sections
import Pulse from 'components/Pulse';
import { CustomAvatar } from 'components/custom-avatar';
import SymbolAvatar from 'components/SymbolAvatar';
import useBinancePrice from 'hooks/useBinancePrice';
import Label from 'components/label';
import { fCorrectNumber } from 'utils/formatNumber';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'status', label: '', align: 'center' },
  { id: 'stepId', label: 'Id', align: 'center', width: 30 },
  { id: 'entryPrice', label: 'Entry Price', align: 'center' },
  { id: 'exitPrice', label: 'Exit Price', align: 'center' },
  { id: 'amount', label: 'Amount', align: 'center' },
  { id: 'realAmount', label: 'Real Amount', align: 'center' },
  // { id: 'startDate', label: 'Start Date', align: 'center' },
  { id: 'orders', label: 'Orders', align: 'left' },
  { id: 'action', label: 'Action', align: 'center' },
  // { id: '' },
];

// ----------------------------------------------------------------------

export default function FlightDetailPage() {
  const { dense, page, rowsPerPage } = useTable();

  const { themeStretch } = useSettingsContext();

  const { id } = useParams();

  const dispatch = useDispatch();

  const { flight, balance } = useSelector((state) => state.flight);
  console.log('flight=>', flight);
  const price = useBinancePrice(flight.symbol);

  // const navigate = useNavigate();
  const [totalSellCount, setTotalSellCount] = useState(0);
  const [totalBuyCount, setTotalBuyCount] = useState(0);
  const [totalSellAmount, setTotalSellAmount] = useState(0);
  const [totalBuyAmount, setTotalBuyAmount] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const [filterStatus, setFilterStatus] = useState('all');

  const [tableData, setTableData] = useState([]);

  const [analytics, setAnalytics] = useState({});

  const getAnalytics = () => {
    let totalSellCount = 0;
    let totalBuyCount = 0;
    let totalSellAmount = 0;
    let totalBuyAmount = 0;
    let totalProfit = 0;

    for (let step of flight.steps) {
      for (let order of step.orders) {
        if (order.side == 'buy' && order.status == 'FILLED') {
          totalBuyAmount += order.amount;
          totalBuyCount++;
        }
        if (order.side == 'sell' && order.status == 'FILLED') {
          totalSellAmount += order.amount;
          totalSellCount++;
        }
        if (order.realStatus == 'NEW') {
          setActiveStep(step.stepId);
        }
      }
    }

    if (totalBuyAmount <= totalSellAmount) {
      totalProfit = totalBuyAmount * flight.stepInterval;
    } else {
      totalProfit = totalSellAmount * flight.stepInterval;
    }

    setTotalSellAmount(totalSellAmount);
    setTotalBuyAmount(totalBuyAmount);
    setTotalSellCount(totalSellCount);
    setTotalBuyCount(totalBuyCount);
    setTotalProfit(totalProfit);
  };

  useEffect(() => {
    if (id) {
      dispatch(getFlight(id));
    }
    const interval = setInterval(() => {
      if (id) {
        dispatch(getFlight(id));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [dispatch, id]);

  useEffect(() => {
    if (flight?.steps?.length > 0) {
      setTableData(flight.steps);
      getAnalytics();
    }
  }, [flight]);

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!tableData.length && !!filterName) ||
    (!tableData.length && !!filterRole) ||
    (!tableData.length && !!filterStatus);

  // const handleOpenConfirm = () => {
  //   setOpenConfirm(true);
  // };

  // const handleCloseConfirm = () => {
  //   setOpenConfirm(false);
  // };

  // const handleFilterStatus = (event, newValue) => {
  //   setPage(0);
  //   setFilterStatus(newValue);
  // };

  // const handleDeleteRow = (id) => {
  //   const deleteRow = tableData.filter((row) => row.id !== id);
  //   setSelected([]);
  //   setTableData(deleteRow);

  //   if (page > 0) {
  //     if (dataInPage.length < 2) {
  //       setPage(page - 1);
  //     }
  //   }
  // };

  // const handleEditRow = (id) => {
  //   navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
  // };

  return (
    <>
      <Helmet>
        <title> Flight: Detail</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Flight Deail"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Flight', href: PATH_DASHBOARD.flight.root },
            { name: 'Detail' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.flight.create}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Flight
            </Button>
          }
        />

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            {flight?.symbol && (
              <SymbolAvatar
                pair={{ baseAsset: flight.baseAsset, quoteAsset: flight.quoteAsset }}
                width={32}
              />
            )}
            <Typography variant="h5">{flight.symbol}</Typography>
            {flight.direction == 'up' ? (
              <Iconify icon="mdi:trending-up" color="primary.main" width={30} />
            ) : (
              <Iconify icon="mdi:trending-down" color="error.main" width={30} />
            )}
            <Label color={flight.status == 1 ? 'primary' : 'warning'} sx={{ fontSize: 16, p: 2 }}>
              {flight.status == 1 ? 'Running' : 'Finished'}
            </Label>
          </Stack>
          <Stack
            component={Card}
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 80,
              zIndex: 1,
              p: 1,
              border: `1px solid ${flight.status == 1 ? 'green' : 'yellow'}`,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>Start Position: {flight.startPosition}</Typography>
              <Label color={flight.status == 1 ? 'primary' : 'warning'}>
                {flight.status == 1 ? 'Running' : 'Finished'}
              </Label>
            </Stack>
            <Typography variant="h4">Price: {price}</Typography>
          </Stack>
        </Stack>

        <Card sx={{ p: 3, px: 5, mt: 3 }}>
          <Stack sx={{ width: 1 }}>
            <Grid container spacing={10}>
              <Grid item md={6} xs={12}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack spacing={1}>
                    <Typography color="text.disabled">Start Position:</Typography>
                    <Typography variant="h5">{flight.startPosition}</Typography>
                  </Stack>
                  <Stack spacing={1}>
                    <Typography color="text.disabled">Steps:</Typography>
                    <Typography variant="h5">{flight.stepCount}</Typography>
                  </Stack>
                  <Stack spacing={1}>
                    <Typography color="text.disabled">Step Interval:</Typography>
                    <Typography variant="h5">
                      {flight.stepInterval} {flight.isStepIntervalPercent && '%'}
                    </Typography>
                  </Stack>
                  <Stack spacing={1}>
                    <Typography color="text.disabled">Step Amount:</Typography>
                    <Typography variant="h5">
                      {flight.stepAmount}
                      {flight.amountAsset}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item md={6} xs={12}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack spacing={1}>
                    <Typography color="text.disabled">Total Buy/Sell Count:</Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Stack direction="row" alignItems="center">
                        <Typography variant="h5">{totalBuyCount}</Typography>
                        <Iconify icon="eva:arrow-upward-fill" color="success.main" />
                      </Stack>
                      <Typography color="text.disabled">|</Typography>
                      <Stack direction="row" alignItems="center">
                        <Typography variant="h5">{totalSellCount}</Typography>
                        <Iconify icon="eva:arrow-downward-fill" color="error.main" />
                      </Stack>
                    </Stack>
                  </Stack>
                  <Stack spacing={1}>
                    <Typography color="text.disabled">Total Take/Give Amount:</Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Stack direction="row" alignItems="center">
                        <Typography variant="h5"> {fCorrectNumber(totalBuyAmount)}</Typography>
                        <Iconify icon="eva:arrow-upward-fill" color="success.main" />
                      </Stack>
                      <Typography color="text.disabled">|</Typography>
                      <Stack direction="row" alignItems="center">
                        <Typography variant="h5">{fCorrectNumber(totalSellAmount)}</Typography>
                        <Iconify icon="eva:arrow-downward-fill" color="error.main" />
                      </Stack>
                    </Stack>
                  </Stack>
                  <Stack spacing={1}>
                    <Typography color="text.disabled">Total Profit:</Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Stack direction="row" alignItems="center">
                        <Typography variant="h5">{fCorrectNumber(totalProfit)}</Typography>
                        <Iconify icon="eva:arrow-upward-fill" color="success.main" />
                      </Stack>
                    </Stack>
                  </Stack>
                  <Stack spacing={1}>
                    <Typography color="text.disabled">Fee:</Typography>
                    <Typography variant="h5">{flight.fee}%</Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Card>

        <Stack sx={{ mt: 3 }} spacing={1}>
          <Typography variant="h5">Spot Balance</Typography>
          <Stack direction="row" spacing={3}>
            <Paper sx={{ p: 2 }}>
              {flight.baseAsset}: {balance?.baseAsset?.free}
            </Paper>
            <Paper sx={{ p: 2 }}>
              {flight.quoteAsset}: {balance?.quoteAsset?.free}
            </Paper>
          </Stack>
        </Stack>

        <Card sx={{ position: 'relative', mt: 3 }}>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} />

                <TableBody>
                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          {/* <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          /> */}
        </Card>
      </Container>
    </>
  );
}
