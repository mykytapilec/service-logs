import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveDraft } from '../redux/slices/draftsSlice';
import { DraftLog } from '../types/index';
import { v4 as uuidv4 } from 'uuid';

export const useAutoSaveDraft = (draft: Omit<DraftLog, 'id' | 'lastSaved'>) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    if (!draft) return;

    const draftId = (draft as DraftLog).id || uuidv4();

    setStatus('saving');

    const timeout = setTimeout(() => {
      const draftToSave: DraftLog = {
        ...draft,
        id: draftId,
        lastSaved: new Date().toISOString(),
      };
      dispatch(saveDraft(draftToSave));
      setStatus('saved');
    }, 500);

    return () => clearTimeout(timeout);
  }, [draft, dispatch]);

  return status;
};
