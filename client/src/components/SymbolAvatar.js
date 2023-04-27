import { Box, Stack } from '@mui/material';
import { CustomAvatarGroup, CustomAvatar } from 'components/custom-avatar';
import Iconify from 'components/iconify';
import { paramCase } from 'change-case';

export default function SymbolAvatar({ pair, size, width }) {
  return (
    <CustomAvatarGroup size={size}>
      <CustomAvatar alt={pair.baseAsset}>
        <Iconify icon={`cryptocurrency-color:${paramCase(pair.baseAsset)}`} width={width} />
      </CustomAvatar>
      <CustomAvatar alt={pair.quoteAsset}>
        {pair.quoteAsset == 'BUSD' ? (
          <Box component="img" src="/assets/icons/busd.png" />
        ) : (
          <Iconify icon={`cryptocurrency-color:${paramCase(pair.quoteAsset)}`} width={width} />
        )}
      </CustomAvatar>
    </CustomAvatarGroup>
  );
}
