import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
  Link,
} from '@mui/material';
// components
import Label from 'components/label';
import Iconify from 'components/iconify';
import MenuPopover from 'components/menu-popover';
import Moment from 'react-moment';
import ConfirmDialog from 'components/confirm-dialog';
import Pulse from 'components/Pulse';
import SymbolAvatar from 'components/SymbolAvatar';
import useBinancePrice from 'hooks/useBinancePrice';
// ----------------------------------------------------------------------

FlightListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function FlightListTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onViewRow,
}) {
  const {
    symbol,
    baseAsset,
    quoteAsset,
    startPosition,
    stepInterval,
    stepAmount,
    createdAt,
    amountAsset,
    status,
  } = row;
  const pair = { baseAsset, quoteAsset };
  const price = useBinancePrice(symbol);

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  return (
    <>
      <TableRow hover>
        <TableCell align="left">
          <Stack direction="row" alignItems="center" spacing={1}>
            <SymbolAvatar pair={pair} size="tiny" width={24} />
            <Link
              noWrap
              color="inherit"
              variant="subtitle2"
              onClick={onViewRow}
              sx={{ cursor: 'pointer' }}
            >
              {symbol}
            </Link>
          </Stack>
        </TableCell>

        <TableCell align="center">{startPosition}</TableCell>
        <TableCell align="center">{stepInterval}</TableCell>
        <TableCell align="center">{stepAmount}</TableCell>

        <TableCell align="center">
          <Moment format="YYYY.MM.DD">{createdAt}</Moment>
        </TableCell>
        <TableCell align="center">{price}</TableCell>
        <TableCell align="center">
          <Stack alignItems="center">
            <Pulse status={status} />
          </Stack>
        </TableCell>
        <TableCell align="center">
          <Stack direction="row" alignItems="center">
            <IconButton color="error" onClick={handleOpenConfirm}>
              <Iconify icon="eva:trash-2-outline" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
