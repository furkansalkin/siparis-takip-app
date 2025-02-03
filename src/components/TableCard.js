import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';

const TableCard = ({ table, isSelected }) => {
  const isActive = table.orders.length > 0;

  return (
    <Card 
      sx={{ 
        height: '150px', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        border: isSelected ? '2px solid #1e1e1e' : '1px solid #e0e0e0',
        boxShadow: isSelected 
          ? '0 8px 16px rgba(0, 0, 0, 0.1)' 
          : '0 2px 4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
        },
        bgcolor: isSelected ? '#fafafa' : 'white',
        cursor: 'pointer'
      }}
    >
      <CardContent 
        sx={{ 
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          p: 2,
          textAlign: 'center'
        }}
      >
        <TableRestaurantIcon sx={{ 
          fontSize: 40, 
          color: isActive ? '#2e7d32' : '#666'
        }} />
        <Typography variant="h6" component="div">
          Masa {table.id}
        </Typography>
        <Chip 
          label={isActive ? 'Aktif' : 'Boş'} 
          size="small"
          color={isActive ? 'success' : 'default'}
          variant={isActive ? "filled" : "outlined"}
          sx={{
            fontWeight: isActive ? 600 : 400,
            fontSize: isActive ? '0.9rem' : '0.8rem',
            px: isActive ? 2 : 1,
            py: isActive ? 0.5 : 0,
            bgcolor: isActive ? '#2e7d32' : 'transparent',
            color: isActive ? 'white' : 'inherit',
            '& .MuiChip-label': {
              px: isActive ? 1 : 0.5
            }
          }}
        />
        {isActive && (
          <Typography 
            variant="subtitle1" 
            sx={{ 
              mt: 1, 
              fontWeight: 600,
              color: '#2e7d32'
            }}
          >
            {table.total} TL
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default TableCard; 