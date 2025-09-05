import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServiceLog } from '../../types';

interface ServiceLogsState {
  logs: ServiceLog[];
}

const savedLogs = localStorage.getItem('serviceLogs');
const initialState: ServiceLogsState = {
  logs: savedLogs ? JSON.parse(savedLogs) : [],
};

const serviceLogsSlice = createSlice({
  name: 'serviceLogs',
  initialState,
  reducers: {
    addLog: (state, action: PayloadAction<ServiceLog>) => {
      if (!state.logs) state.logs = [];
      state.logs.push(action.payload);
      localStorage.setItem('serviceLogs', JSON.stringify(state.logs));
    },
    updateLog: (state, action: PayloadAction<ServiceLog>) => {
      if (!state.logs) state.logs = [];
      const index = state.logs.findIndex(log => log.id === action.payload.id);
      if (index >= 0) state.logs[index] = action.payload;
      localStorage.setItem('serviceLogs', JSON.stringify(state.logs));
    },
    deleteLog: (state, action: PayloadAction<string>) => {
      if (!state.logs) state.logs = [];
      state.logs = state.logs.filter(log => log.id !== action.payload);
      localStorage.setItem('serviceLogs', JSON.stringify(state.logs));
    },
  },
});

export const { addLog, updateLog, deleteLog } = serviceLogsSlice.actions;
export default serviceLogsSlice.reducer;
