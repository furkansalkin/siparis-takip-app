import React from 'react';
import { useDispatch } from 'react-redux';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Paper, Divider } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { addOrder } from '../store/tableSlice';
import { menuItems } from '../data/menuItems';

const MenuList = ({ selectedTable }) => {
  const dispatch = useDispatch();

  const handleAddOrder = (item) => {
    if (selectedTable) {
      dispatch(addOrder({ tableId: selectedTable, item }));
    }
  };

  return (
    <Paper 
      sx={{ 
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}
    >
      <List sx={{ p: 0, overflowY: 'auto', height: '100%' }}>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.id}>
            <ListItem 
              sx={{ 
                py: 2,
                px: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#f5f5f5'
                }
              }}
            >
              <ListItemText
                primary={item.name}
                secondary={`${item.price} TL`}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '0.95rem'
                }}
                secondaryTypographyProps={{
                  color: 'text.primary',
                  fontWeight: 500
                }}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleAddOrder(item)}
                  disabled={!selectedTable}
                  sx={{
                    color: selectedTable ? '#1e1e1e' : '#ccc',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: selectedTable ? '#1e1e1e' : '#ccc',
                    minWidth: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      bgcolor: selectedTable ? '#1e1e1e' : 'transparent',
                      color: selectedTable ? '#fff' : '#ccc'
                    },
                    '&.Mui-disabled': {
                      opacity: 0.5,
                      border: '1px solid #ccc'
                    }
                  }}
                >
                  <AddCircleIcon sx={{ fontSize: 24, mr: 0.5 }} />
                  Ekle
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            {index < menuItems.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default MenuList; 