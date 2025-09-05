import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveDraft, deleteDraft } from '../redux/slices/draftsSlice';
import { addLog } from '../redux/slices/logsSlice';
import { ServiceType, ServiceLog } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../redux/store';
import { useAutoSaveDraft } from '../hooks/useAutoSaveDraft';
import { DraftLog } from '../types/index';

export const ServiceLogForm = () => {
  const dispatch = useDispatch();
  const drafts = useSelector((state: RootState) => state.drafts.drafts);

  const initialFormData: Omit<DraftLog, 'id' | 'lastSaved'> = drafts.length
    ? {
        providerId: drafts[drafts.length - 1].providerId,
        serviceOrder: drafts[drafts.length - 1].serviceOrder,
        carId: drafts[drafts.length - 1].carId,
        odometer: drafts[drafts.length - 1].odometer,
        engineHours: drafts[drafts.length - 1].engineHours,
        startDate: drafts[drafts.length - 1].startDate,
        endDate: drafts[drafts.length - 1].endDate,
        type: drafts[drafts.length - 1].type,
        serviceDescription: drafts[drafts.length - 1].serviceDescription,
      }
    : {
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

  const status = useAutoSaveDraft(formData);

  useEffect(() => {
    if (drafts.length) {
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
    }
  }, [drafts]);

  const handleCreateLog = () => {
    const newLog: ServiceLog = {
      ...formData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    dispatch(addLog(newLog));

    const latestDraftId = drafts[drafts.length - 1]?.id;
    if (latestDraftId) dispatch(deleteDraft(latestDraftId));

    setFormData({
      providerId: '',
      serviceOrder: '',
      carId: '',
      odometer: 0,
      engineHours: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      type: 'planned',
      serviceDescription: '',
    });
  };

  return (
    <form className="flex flex-col gap-2 p-2 border rounded">
      <input
        placeholder="Provider ID"
        value={formData.providerId}
        onChange={e => setFormData({ ...formData, providerId: e.target.value })}
        className="border rounded p-2"
      />
      <input
        placeholder="Service Order"
        value={formData.serviceOrder}
        onChange={e => setFormData({ ...formData, serviceOrder: e.target.value })}
        className="border rounded p-2"
      />
      <input
        placeholder="Car ID"
        value={formData.carId}
        onChange={e => setFormData({ ...formData, carId: e.target.value })}
        className="border rounded p-2"
      />
      <input
        type="number"
        placeholder="Odometer"
        value={formData.odometer}
        onChange={e => setFormData({ ...formData, odometer: Number(e.target.value) })}
        className="border rounded p-2"
      />
      <input
        type="number"
        placeholder="Engine Hours"
        value={formData.engineHours}
        onChange={e => setFormData({ ...formData, engineHours: Number(e.target.value) })}
        className="border rounded p-2"
      />
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
        className="border rounded p-2"
      />
      <input
        type="date"
        value={formData.endDate}
        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
        className="border rounded p-2"
      />
      <select
        value={formData.type}
        onChange={e => setFormData({ ...formData, type: e.target.value as ServiceType })}
        className="border rounded p-2"
      >
        <option value="planned">Planned</option>
        <option value="unplanned">Unplanned</option>
        <option value="emergency">Emergency</option>
      </select>
      <textarea
        placeholder="Service Description"
        value={formData.serviceDescription}
        onChange={e => setFormData({ ...formData, serviceDescription: e.target.value })}
        className="border rounded p-2"
      />

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
    </form>
  );
};
