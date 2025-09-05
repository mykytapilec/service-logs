import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DraftLog } from '../../types/index';

interface DraftsState {
  drafts: DraftLog[];
}

const initialState: DraftsState = {
  drafts: [],
};

const draftsSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    saveDraft: (state, action: PayloadAction<DraftLog>) => {
      const index = state.drafts.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.drafts[index] = action.payload;
      } else {
        state.drafts.push(action.payload);
      }
    },
    deleteDraft: (state, action: PayloadAction<string>) => {
      state.drafts = state.drafts.filter(d => d.id !== action.payload);
    },
    clearDrafts: state => {
      state.drafts = [];
    },
  },
});

export const { saveDraft, deleteDraft, clearDrafts } = draftsSlice.actions;
export default draftsSlice.reducer;
