import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

const glow = keyframes`
  0% {
    transform: scale(1.2);
    color: #00AB55;
}

100% {
  transform: scale(1);
  color: white;
}
`;

export default function GlowingText({ label, ...others }) {
  const [value, setValue] = useState(false);
  useEffect(() => {
    setValue(true);
  }, [label]);

  return (
    <Typography
      {...others}
      sx={{
        transform: 'scale(1)',
        animation: value && `${glow} 0.5s 2`,
      }}
    >
      {label}
    </Typography>
  );
}
