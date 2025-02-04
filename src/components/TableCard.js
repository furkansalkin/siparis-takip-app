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
        {isActive ? (
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600,
              color: '#2e7d32',
              bgcolor: '#e8f5e9',
              px: 2,
              py: 0.5,
              borderRadius: 2
            }}
          >
            {table.total} TL
          </Typography>
        ) : (
          <Chip 
            label="Boş"
            size="small"
            color="default"
            variant="outlined"
            sx={{
              fontWeight: 400,
              fontSize: '0.8rem'
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TableCard; 