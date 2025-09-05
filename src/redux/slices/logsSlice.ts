import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServiceLog } from '../../types';

interface LogsState {
  logs: ServiceLog[];
}

const initialState: LogsState = {
  logs: [],
};

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    addLog: (state, action: PayloadAction<ServiceLog>) => {
      state.logs.push(action.payload);
    },
    updateLog: (state, action: PayloadAction<ServiceLog>) => {
      const index = state.logs.findIndex(log => log.id === action.payload.id);
      if (index !== -1) state.logs[index] = action.payload;
    },
    deleteLog: (state, action: PayloadAction<string>) => {
      state.logs = state.logs.filter(log => log.id !== action.payload);
    },
  },
});

export const { addLog, updateLog, deleteLog } = logsSlice.actions;
export default logsSlice.reducer;
