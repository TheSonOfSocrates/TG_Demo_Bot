import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  Grid,
  Typography,
  Stack,
  Hidden,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
// routes
import { PATH_DASHBOARD } from 'routes/paths';
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
import { deleteFlight, getFlights } from 'redux/slices/flight';
// sections
import FlightListTableRow from './FlightComponents/FlightListTableRow';

import { useAuthContext } from '../auth/useAuthContext';

// ----------------------------------------------------------------------
const STATUS_OPTIONS = [
  { status: 'active', value: 1, color: 'primary' },
  { status: 'finished', value: 0, color: 'warning' },
  { status: 'all', value: 'all', color: '' },
  // { status: 'failed', value: -1, color: 'error' },
];

const TABLE_HEAD = [
  { id: 'symbol', label: 'Symbol', align: 'left' },
  { id: 'startPosition', label: 'Start Position', align: 'center' },
  { id: 'stepInterval', label: 'Step Interval', align: 'center' },
  { id: 'stepAmount', label: 'Step Amount', align: 'center' },
  { id: 'startDate', label: 'Start Date', align: 'center' },
  { id: 'price', label: 'Price', align: 'center', width: 100 },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'action', label: 'Action', align: 'center' },
  // { id: '' },
];

// ----------------------------------------------------------------------

export default function FlightListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();
  const { flights, isLoading, totalProfit } = useSelector((state) => state.flight);

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const [filterStatus, setFilterStatus] = useState(1);

  const [btcbusdCount, setBtcbusdCount] = useState([]);
  const [ethbtcCount, setEthbtcCount] = useState([]);

  const { isValidLicenseKey, isConnected } = useAuthContext();

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row._id != id);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }

    dispatch(deleteFlight(id));
  };

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.flight.view(id));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterRole('all');
    setFilterStatus('all');
  };

  useEffect(() => {
    dispatch(getFlights());
    const interval = setInterval(() => {
      dispatch(getFlights());
    }, 2000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (flights.length) {
      setTableData(flights);
    }
  }, [flights]);

  return (
    <>
      <Helmet>
        <title> Flight: List</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Flight List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Flight', href: PATH_DASHBOARD.flight.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.flight.create}
              variant="contained"
              disabled={!isValidLicenseKey || !isConnected}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Flight
            </Button>
          }
        />
        <Card>
          <Tabs
            value={filterStatus}
            onChange={handleFilterStatus}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.status}
                label={tab.status}
                value={tab.value}
                icon={
                  tab.status != 'all' ? (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: `${tab.color}.main`,
                      }}
                    />
                  ) : (
                    <></>
                  )
                }
              />
            ))}
          </Tabs>

          <Divider />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size="small" sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                  // order={order}
                  // orderBy={orderBy}
                  // rowCount={tableData.length}
                  // numSelected={selected.length}
                  // onSort={onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <FlightListTableRow
                        key={row._id}
                        row={row}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            // dense={dense}
            // onChangeDense={onChangeDense}
          />
        </Card>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus, filterRole }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (flight) => flight.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((flight) => flight.status === filterStatus);
  }

  if (filterRole !== 'all') {
    inputData = inputData.filter((flight) => flight.role === filterRole);
  }

  return inputData;
}
