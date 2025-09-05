import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDraft } from '../redux/slices/draftsSlice';
import { addLog } from '../redux/slices/logsSlice';
import { ServiceType, ServiceLog } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../redux/store';
import { useAutoSaveDraft } from '../hooks/useAutoSaveDraft';
import { DraftLog } from '../types/index';

export const ServiceLogForm = () => {
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

  const [formData, setFormData] = useState<Omit<DraftLog, 'id' | 'lastSaved'>>(initialFormData);
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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.providerId.trim()) newErrors.providerId = 'Provider ID is required';
    if (!formData.serviceOrder.trim()) newErrors.serviceOrder = 'Service Order is required';
    if (!formData.carId.trim()) newErrors.carId = 'Car ID is required';
    if (formData.odometer <= 0) newErrors.odometer = 'Odometer must be greater than 0';
    if (formData.engineHours < 0) newErrors.engineHours = 'Engine hours cannot be negative';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date cannot be before start date';
    }
    if (!formData.serviceDescription.trim()) newErrors.serviceDescription = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateLog = () => {
    if (!validate()) return;

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

  const inputClass = (field: string) =>
    `border rounded p-2 ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;

  return (
    <form className="flex flex-col gap-2 p-2 border rounded">
      <input
        placeholder="Provider ID"
        value={formData.providerId}
        onChange={e => setFormData({ ...formData, providerId: e.target.value })}
        className={inputClass('providerId')}
      />
      {errors.providerId && <span className="text-red-500 text-sm">{errors.providerId}</span>}

      <input
        placeholder="Service Order"
        value={formData.serviceOrder}
        onChange={e => setFormData({ ...formData, serviceOrder: e.target.value })}
        className={inputClass('serviceOrder')}
      />
      {errors.serviceOrder && <span className="text-red-500 text-sm">{errors.serviceOrder}</span>}

      <input
        placeholder="Car ID"
        value={formData.carId}
        onChange={e => setFormData({ ...formData, carId: e.target.value })}
        className={inputClass('carId')}
      />
      {errors.carId && <span className="text-red-500 text-sm">{errors.carId}</span>}

      <input
        type="number"
        placeholder="Odometer"
        value={formData.odometer}
        onChange={e => setFormData({ ...formData, odometer: Number(e.target.value) })}
        className={inputClass('odometer')}
      />
      {errors.odometer && <span className="text-red-500 text-sm">{errors.odometer}</span>}

      <input
        type="number"
        placeholder="Engine Hours"
        value={formData.engineHours}
        onChange={e => setFormData({ ...formData, engineHours: Number(e.target.value) })}
        className={inputClass('engineHours')}
      />
      {errors.engineHours && <span className="text-red-500 text-sm">{errors.engineHours}</span>}

      <input
        type="date"
        value={formData.startDate}
        onChange={e => {
          const newStart = e.target.value;
          const newEnd = new Date(new Date(newStart).getTime() + 86400000)
            .toISOString()
            .split('T')[0];
          setFormData({ ...formData, startDate: newStart, endDate: newEnd });
        }}
        className={inputClass('startDate')}
      />
      {errors.startDate && <span className="text-red-500 text-sm">{errors.startDate}</span>}

      <input
        type="date"
        value={formData.endDate}
        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
        className={inputClass('endDate')}
      />
      {errors.endDate && <span className="text-red-500 text-sm">{errors.endDate}</span>}

      <select
        value={formData.type}
        onChange={e => setFormData({ ...formData, type: e.target.value as ServiceType })}
        className={inputClass('type')}
      >
        <option value="planned">Planned</option>
        <option value="unplanned">Unplanned</option>
        <option value="emergency">Emergency</option>
      </select>

      <textarea
        placeholder="Service Description"
        value={formData.serviceDescription}
        onChange={e => setFormData({ ...formData, serviceDescription: e.target.value })}
        className={inputClass('serviceDescription')}
      />
      {errors.serviceDescription && (
        <span className="text-red-500 text-sm">{errors.serviceDescription}</span>
      )}

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
