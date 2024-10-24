import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Battery({ percentage }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h6" gutterBottom>
        Battery: {percentage}%
      </Typography>
      <Box width="100%" maxWidth={200}>
        <LinearProgress variant="determinate" value={percentage} />
      </Box>
    </Box>
  );
}

export default Battery;
