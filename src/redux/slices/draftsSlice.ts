import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DraftLog } from '../../types/index';

interface DraftsState {
  drafts: DraftLog[];
}

const initialState: DraftsState = { drafts: [] };

const draftsSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    saveDraft: (state, action: PayloadAction<DraftLog>) => {
      const index = state.drafts.findIndex(d => d.serviceOrder === action.payload.serviceOrder);
      if (index >= 0) state.drafts[index] = action.payload;
      else state.drafts.push(action.payload);
    },
    deleteDraft: (state, action: PayloadAction<string>) => {
      state.drafts = state.drafts.filter(d => d.serviceOrder !== action.payload);
    },
    clearAllDrafts: state => { state.drafts = []; },
  },
});

export const { saveDraft, deleteDraft, clearAllDrafts } = draftsSlice.actions;
export default draftsSlice.reducer;
