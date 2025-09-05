import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ServiceLog } from '../types'

interface LogsState {
  items: ServiceLog[]
}

const initialState: LogsState = { items: [] }

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    addLog(state, action: PayloadAction<ServiceLog>) {
      state.items.push(action.payload)
    },
    updateLog(state, action: PayloadAction<ServiceLog>) {
      const idx = state.items.findIndex(l => l.id === action.payload.id)
      if (idx >= 0) state.items[idx] = action.payload
    },
    removeLog(state, action: PayloadAction<{ id: string }>) {
      state.items = state.items.filter(l => l.id !== action.payload.id)
    }
  }
})

export const { addLog, updateLog, removeLog } = logsSlice.actions
export default logsSlice.reducer
