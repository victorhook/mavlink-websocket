import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function KeyValue({ name, value }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h6" gutterBottom>
        { name } {value}
      </Typography>
    </Box>
  );
}

export default KeyValue;
