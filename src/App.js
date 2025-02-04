import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { Container, Grid, CssBaseline, ToggleButton, ToggleButtonGroup, Box, Typography, Paper, AppBar, Toolbar, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Button, useTheme, useMediaQuery, Tabs, Tab } from '@mui/material';
import { store } from './store/store';
import TableCard from './components/TableCard';
import MenuList from './components/MenuList';
import { useSelector, useDispatch } from 'react-redux';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { removeOrder, clearTable } from './store/tableSlice';

function AppContent() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState(0);
  const [expandedSection, setExpandedSection] = useState('menu'); // 'menu' veya 'details'
  const tables = useSelector(state => state.tables.tables);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleFilterChange = (event, newFilter) => {
    setFilter(newFilter || 'all');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filteredTables = tables.filter(table => {
    if (filter === 'active') {
      return table.orders.length > 0;
    } else if (filter === 'inactive') {
      return table.orders.length === 0;
    }
    return true;
  });

  const selectedTableData = tables.find(t => t.id === selectedTable);

  const handleRemoveOrder = (orderId) => {
    dispatch(removeOrder({ tableId: selectedTable, orderId }));
  };

  const handleClearTable = () => {
    dispatch(clearTable({ tableId: selectedTable }));
    if (isMobile) setActiveTab(0);
  };

  const handleTableClick = (tableId) => {
    setSelectedTable(tableId);
    if (isMobile) setActiveTab(1);
  };

  const handleSectionClick = (section) => {
    setExpandedSection(section);
  };

  const renderContent = () => {
    if (isMobile) {
      switch (activeTab) {
        case 0: // Masalar
          return (
            <Grid container spacing={2} sx={{ height: 'calc(100vh - 140px)', overflowY: 'auto', p: 1 }}>
              {filteredTables.map((table) => (
                <Grid item xs={6} key={table.id} onClick={() => handleTableClick(table.id)}>
                  <TableCard table={table} isSelected={selectedTable === table.id} />
                </Grid>
              ))}
            </Grid>
          );
        case 1: // Sipariş ve Detay
          return selectedTableData ? (
            <Box sx={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Detaylar Bölümü */}
              <Paper 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  flex: expandedSection === 'details' ? '1' : '0 0 auto',
                }}
              >
                <Box 
                  onClick={() => handleSectionClick('details')}
                  sx={{ 
                    py: 1.5, 
                    px: 2, 
                    bgcolor: '#1e1e1e', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: '#2c2c2c'
                    }
                  }}
                >
                  <RestaurantIcon sx={{ fontSize: 20, mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Masa {selectedTableData.id} - Detaylar
                  </Typography>
                </Box>
                {expandedSection === 'details' && (
                  <>
                    <List sx={{ 
                      flex: 1, 
                      overflowY: 'auto', 
                      p: 0,
                    }}>
                      {Object.values(
                        selectedTableData.orders.reduce((acc, order) => {
                          const key = `${order.name}-${order.price}`;
                          if (!acc[key]) {
                            acc[key] = {
                              ...order,
                              count: 1,
                              totalPrice: order.price
                            };
                          } else {
                            acc[key].count += 1;
                            acc[key].totalPrice = acc[key].price * acc[key].count;
                          }
                          return acc;
                        }, {})
                      ).map((order) => (
                        <ListItem 
                          key={order.orderId}
                          sx={{ 
                            borderBottom: '1px solid #f0f0f0',
                            py: 1
                          }}
                        >
                          <ListItemText
                            primary={`${order.name} ${order.count > 1 ? `x${order.count}` : ''}`}
                            secondary={`${order.totalPrice} TL`}
                            primaryTypographyProps={{
                              fontSize: '0.9rem',
                              fontWeight: 500
                            }}
                            secondaryTypographyProps={{
                              color: 'primary',
                              fontSize: '0.85rem'
                            }}
                          />
                          <ListItemSecondaryAction>
                            <IconButton 
                              edge="end" 
                              onClick={() => handleRemoveOrder(order.orderId)}
                              size="small"
                            >
                              <DeleteIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                    <Box sx={{ p: 2, borderTop: '1px solid #f0f0f0', bgcolor: '#fafafa' }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          textAlign: 'center', 
                          mb: 1,
                          fontWeight: 600 
                        }}
                      >
                        Toplam: {selectedTableData.total} TL
                      </Typography>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleClearTable}
                        fullWidth
                        size="small"
                        sx={{
                          borderRadius: 2,
                          py: 1,
                          bgcolor: '#1e1e1e',
                          '&:hover': { bgcolor: '#333' }
                        }}
                      >
                        Hesabı Kapat
                      </Button>
                    </Box>
                  </>
                )}
              </Paper>

              {/* Menü Bölümü */}
              <Paper 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  flex: expandedSection === 'menu' ? '1' : '0 0 auto',
                }}
              >
                <Box 
                  onClick={() => handleSectionClick('menu')}
                  sx={{ 
                    py: 1.5, 
                    px: 2, 
                    bgcolor: '#1e1e1e', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: '#2c2c2c'
                    }
                  }}
                >
                  <MenuBookIcon sx={{ fontSize: 20, mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Menü
                  </Typography>
                </Box>
                {expandedSection === 'menu' && (
                  <Box sx={{ 
                    flex: 1, 
                    overflowY: 'auto',
                  }}>
                    <MenuList selectedTable={selectedTable} />
                  </Box>
                )}
              </Paper>
            </Box>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography>Lütfen bir masa seçin</Typography>
            </Box>
          );
        default:
          return null;
      }
    }

    // Desktop view
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            {filteredTables.map((table) => (
              <Grid item xs={12} sm={6} md={4} key={table.id} 
                onClick={() => setSelectedTable(table.id)}>
                <TableCard table={table} isSelected={selectedTable === table.id} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        
        <Grid item xs={12} md={3}>
          {selectedTableData && (
            <Paper sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, bgcolor: '#1e1e1e', color: 'white' }}>
                <Typography variant="h6">Masa {selectedTableData.id} - Detaylar</Typography>
              </Box>
              <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
                {Object.values(
                  selectedTableData.orders.reduce((acc, order) => {
                    const key = `${order.name}-${order.price}`;
                    if (!acc[key]) {
                      acc[key] = {
                        ...order,
                        count: 1,
                        totalPrice: order.price
                      };
                    } else {
                      acc[key].count += 1;
                      acc[key].totalPrice = acc[key].price * acc[key].count;
                    }
                    return acc;
                  }, {})
                ).map((order) => (
                  <ListItem 
                    key={order.orderId}
                    sx={{ borderBottom: '1px solid #f0f0f0' }}
                  >
                    <ListItemText
                      primary={`${order.name} ${order.count > 1 ? `x${order.count}` : ''}`}
                      secondary={`${order.totalPrice} TL`}
                      primaryTypographyProps={{
                        fontSize: '1rem',
                        fontWeight: 500
                      }}
                      secondaryTypographyProps={{
                        color: 'primary',
                        fontWeight: 500
                      }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        onClick={() => handleRemoveOrder(order.orderId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              <Box sx={{ p: 2, borderTop: '1px solid #f0f0f0', bgcolor: '#fafafa' }}>
                <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
                  Toplam: {selectedTableData.total} TL
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleClearTable}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    bgcolor: '#1e1e1e',
                    '&:hover': { bgcolor: '#333' }
                  }}
                >
                  Hesabı Kapat
                </Button>
              </Box>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={3}>
          <MenuList selectedTable={selectedTable} />
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ bgcolor: '#1e1e1e' }}>
        <Toolbar variant="dense">
          <RestaurantIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1, fontWeight: 500 }}>
            Restoran Sipariş Takip
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 1, mb: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!isMobile && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              mb: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              bgcolor: 'white',
              borderRadius: 2
            }}
          >
            <Typography variant="h6" component="div" sx={{ color: '#666' }}>
              Masa Durumu:
            </Typography>
            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={handleFilterChange}
              aria-label="masa filtresi"
              sx={{
                '& .MuiToggleButton-root': {
                  borderRadius: '8px !important',
                  mx: 0.5,
                  border: '1px solid #e0e0e0',
                  '&.Mui-selected': {
                    bgcolor: '#1e1e1e',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#333',
                    },
                  },
                },
              }}
            >
              <ToggleButton value="all" aria-label="tüm masalar">
                Tüm Masalar
              </ToggleButton>
              <ToggleButton value="active" aria-label="aktif masalar">
                Aktif Masalar
              </ToggleButton>
              <ToggleButton value="inactive" aria-label="boş masalar">
                Boş Masalar
              </ToggleButton>
            </ToggleButtonGroup>
          </Paper>
        )}

        {isMobile && (
          <Paper sx={{ mb: 1 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="fullWidth"
              sx={{
                minHeight: 40,
                '& .MuiTab-root': {
                  minHeight: 40,
                  py: 0.5,
                },
                '& .Mui-selected': {
                  color: '#1e1e1e !important',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#1e1e1e',
                },
              }}
            >
              <Tab 
                icon={<RestaurantIcon sx={{ fontSize: 20 }} />} 
                label="Masalar" 
                sx={{ fontSize: '0.9rem' }}
              />
              <Tab 
                icon={<MenuBookIcon sx={{ fontSize: 20 }} />} 
                label="Sipariş ve Detay" 
                disabled={!selectedTable}
                sx={{ fontSize: '0.9rem' }}
              />
            </Tabs>
          </Paper>
        )}

        {renderContent()}
      </Container>
    </Box>
  );
}

function App() {
  return (
    <Provider store={store}>
      <CssBaseline />
      <AppContent />
    </Provider>
  );
}

export default App; 