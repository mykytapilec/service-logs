import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveDraft } from '../redux/slices/draftsSlice';
import { DraftLog } from '../types/index';
import { v4 as uuidv4 } from 'uuid';


export const useAutoSaveDraft = (
  draft: Omit<DraftLog, 'id' | 'lastSaved'>,
  existingDraftId?: string | undefined
) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const debounceRef = useRef<number | null>(null);
  const draftIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (existingDraftId) draftIdRef.current = existingDraftId;
    else draftIdRef.current = null;
  }, [existingDraftId]);

  const isEmpty = () => {
    return (
      (!draft.providerId || draft.providerId.trim() === '') &&
      (!draft.serviceOrder || draft.serviceOrder.trim() === '') &&
      (!draft.carId || draft.carId.trim() === '') &&
      (!draft.serviceDescription || draft.serviceDescription.trim() === '') &&
      (draft.odometer === 0 || draft.odometer === undefined || draft.odometer === null) &&
      (draft.engineHours === 0 || draft.engineHours === undefined || draft.engineHours === null)
    );
  };

  useEffect(() => {
    if (isEmpty()) {
      setStatus('idle');
      return;
    }

    setStatus('saving');

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      if (!draftIdRef.current) draftIdRef.current = uuidv4();

      const draftToSave: DraftLog = {
        ...(draft as DraftLog),
        id: draftIdRef.current,
        lastSaved: new Date().toISOString(),
      };

      dispatch(saveDraft(draftToSave));
      setStatus('saved');
    }, 500);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [JSON.stringify(draft), dispatch]);

  return status;
};
