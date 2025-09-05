import { RootState } from '../store';

export const selectLogs = (state: RootState) => state.logs.logs ?? [];
