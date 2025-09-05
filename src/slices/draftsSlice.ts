import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Draft } from '../types'

interface DraftsState {
  items: Draft[]
}

const initialState: DraftsState = { items: [] }

const draftsSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    upsertDraft(state, action: PayloadAction<Draft>) {
      const idx = state.items.findIndex(d => d.draftId === action.payload.draftId)
      if (idx >= 0) state.items[idx] = action.payload
      else state.items.push(action.payload)
    },
    removeDraft(state, action: PayloadAction<{ draftId: string }>) {
      state.items = state.items.filter(d => d.draftId !== action.payload.draftId)
    },
    clearDrafts(state) {
      state.items = []
    }
  }
})

export const { upsertDraft, removeDraft, clearDrafts } = draftsSlice.actions
export default draftsSlice.reducer
