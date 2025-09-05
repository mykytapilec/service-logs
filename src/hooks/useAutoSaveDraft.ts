import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { saveDraft } from '../redux/slices/draftsSlice';
import { DraftLog } from '../types/index';

export const useAutoSaveDraft = (draft: DraftLog, delay = 500) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(saveDraft({ ...draft, lastSaved: new Date().toISOString() }));
    }, delay);

    return () => clearTimeout(timeout);
  }, [draft, delay, dispatch]);
};
