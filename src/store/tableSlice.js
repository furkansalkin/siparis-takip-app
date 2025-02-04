import { createSlice } from '@reduxjs/toolkit';

// localStorage'dan verileri al veya varsayılan değerleri kullan
const loadInitialState = () => {
  const savedState = localStorage.getItem('tableState');
  if (savedState) {
    return JSON.parse(savedState);
  }
  return {
    tables: Array(10).fill(null).map((_, index) => ({
      id: index + 1,
      orders: [],
      total: 0
    }))
  };
};

const initialState = loadInitialState();

export const tableSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      const { tableId, item } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) {
        table.orders.push({ ...item, orderId: Date.now() });
        table.total = table.orders.reduce((sum, order) => sum + order.price, 0);
        // State güncellendiğinde localStorage'a kaydet
        localStorage.setItem('tableState', JSON.stringify(state));
      }
    },
    removeOrder: (state, action) => {
      const { tableId, orderId } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) {
        table.orders = table.orders.filter(order => order.orderId !== orderId);
        table.total = table.orders.reduce((sum, order) => sum + order.price, 0);
        localStorage.setItem('tableState', JSON.stringify(state));
      }
    },
    clearTable: (state, action) => {
      const { tableId } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) {
        table.orders = [];
        table.total = 0;
        localStorage.setItem('tableState', JSON.stringify(state));
      }
    }
  }
});

export const { addOrder, removeOrder, clearTable } = tableSlice.actions;
export default tableSlice.reducer; 