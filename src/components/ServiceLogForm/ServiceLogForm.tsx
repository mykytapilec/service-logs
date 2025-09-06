import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDraft } from '../../redux/slices/draftsSlice';
import { addLog } from '../../redux/slices/logsSlice';
import { ServiceType, ServiceLog } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../redux/store';
import { useAutoSaveDraft } from '../../hooks/useAutoSaveDraft';
import { DraftLog } from '../../types/index';
import { ServiceLogFields } from './ServiceLogFields';
import { validateServiceLogForm } from '../../utils/validation';

export const ServiceLogForm: React.FC = () => {
  const dispatch = useDispatch();
  const drafts = useSelector((state: RootState) => state.drafts.drafts);

  const initialFormData: Omit<DraftLog, 'id' | 'lastSaved'> = {
    providerId: '',
    serviceOrder: '',
    carId: '',
    odometer: 0,
    engineHours: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    type: 'planned',
    serviceDescription: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  const loadedOnceRef = useRef(false);
  useEffect(() => {
    if (!loadedOnceRef.current && drafts.length) {
      const lastDraft = drafts[drafts.length - 1];
      setFormData({
        providerId: lastDraft.providerId,
        serviceOrder: lastDraft.serviceOrder,
        carId: lastDraft.carId,
        odometer: lastDraft.odometer,
        engineHours: lastDraft.engineHours,
        startDate: lastDraft.startDate,
        endDate: lastDraft.endDate,
        type: lastDraft.type,
        serviceDescription: lastDraft.serviceDescription,
      });
      loadedOnceRef.current = true;
    }
  }, [drafts]);

  const existingDraftId = drafts.length ? drafts[drafts.length - 1].id : undefined;
  const status = useAutoSaveDraft(formData, existingDraftId);

  const handleChange = (key: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateLog = () => {
    const newErrors = validateServiceLogForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const newLog: ServiceLog = {
      ...formData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    dispatch(addLog(newLog));

    const latestDraftId = drafts[drafts.length - 1]?.id;
    if (latestDraftId) dispatch(deleteDraft(latestDraftId));

    setFormData(initialFormData);
    setErrors({});
    setMessage(`✅ Log for car ${newLog.carId} created`);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <form className="flex flex-col gap-2 p-2 border rounded">
      <ServiceLogFields formData={formData} errors={errors} onChange={handleChange} />

      <div className="flex items-center gap-2 mt-2">
        <button
          type="button"
          onClick={handleCreateLog}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Service Log
        </button>
        <span className="text-sm text-gray-500">
          {status === 'saving' && 'Saving...'}
          {status === 'saved' && 'Draft saved'}
        </span>
      </div>

      {message && <div className="mt-2 text-green-600 text-sm">{message}</div>}
    </form>
  );
};
