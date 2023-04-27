import { Box, Stack } from '@mui/material';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 171, 85, 0.7);
}

70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(0, 171, 85, 0);
}

100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 171, 85, 0);
}
`;

export default function Pulse({ status, sx }) {
  return (
    <Box
      sx={{
        width: 10,
        height: 10,
        bgcolor: status == 1 ? '#00AB55' : status == 0 ? '#FFAB00' : '#FF5630',
        borderRadius: '50%',
        boxShadow: '0 0 0 0 rgba(0, 171, 85, 1)',
        transform: 'scale(1)',
        animation: status == 1 && `${pulse} 2s infinite`,
        ...sx
      }}
    />
  );
}
