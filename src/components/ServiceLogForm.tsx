import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addLog } from '../redux/slices/logsSlice';
import { deleteDraft } from '../redux/slices/draftsSlice';
import { ServiceLog, ServiceType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useAutoSaveDraft } from '../hooks/useAutoSaveDraft';
import { DraftLog } from '../types/index';

export const ServiceLogForm: React.FC = () => {
  const dispatch = useDispatch();
  const firstInputRef = useRef<HTMLInputElement>(null);

  const initialForm: DraftLog = {
    id: uuidv4(),
    providerId: '',
    serviceOrder: '',
    carId: '',
    odometer: '',
    engineHours: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0],
    type: 'planned',
    serviceDescription: '',
  };

  const [form, setForm] = useState<DraftLog>(initialForm);
  const [status, setStatus] = useState('Draft not saved');
  const [notification, setNotification] = useState('');

  useAutoSaveDraft(form);

  const handleChange = (key: keyof DraftLog, value: any) => {
    if (key === 'startDate') {
      const newEndDate = new Date(new Date(value).getTime() + 24*60*60*1000)
        .toISOString().split('T')[0];
      setForm({ ...form, startDate: value, endDate: newEndDate });
    } else {
      setForm({ ...form, [key]: value });
    }
    setStatus('Saving...');
  };

  const handleSubmit = () => {
    const { id: draftId, odometer, engineHours, ...rest } = form;
    const newLog: ServiceLog = {
      id: uuidv4(),
      ...rest,
      odometer: Number(odometer),
      engineHours: Number(engineHours),
      createdAt: new Date().toISOString(),
    };

    dispatch(addLog(newLog));
    dispatch(deleteDraft(draftId));

    setForm({ ...initialForm, id: uuidv4() });
    setTimeout(() => firstInputRef.current?.focus(), 0);

    setNotification('Service log created!');
    setTimeout(() => setNotification(''), 2000);
    setStatus('Draft not saved');
  };

  return (
    <div className="bg-white shadow rounded p-4 mb-4 relative">
      <h2 className="text-xl font-bold mb-4">Create Service Log</h2>
      {notification && (
        <div className="absolute top-2 right-2 bg-green-200 text-green-800 p-2 rounded shadow">
          {notification}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <input
          ref={firstInputRef}
          placeholder="Provider ID"
          value={form.providerId}
          onChange={e => handleChange('providerId', e.target.value)}
          className="border rounded p-2"
        />
        <input
          placeholder="Service Order"
          value={form.serviceOrder}
          onChange={e => handleChange('serviceOrder', e.target.value)}
          className="border rounded p-2"
        />
        <input
          placeholder="Car ID"
          value={form.carId}
          onChange={e => handleChange('carId', e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="number"
          placeholder="Odometer"
          value={form.odometer}
          onChange={e => handleChange('odometer', e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="number"
          placeholder="Engine Hours"
          value={form.engineHours}
          onChange={e => handleChange('engineHours', e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="date"
          value={form.startDate}
          onChange={e => handleChange('startDate', e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="date"
          value={form.endDate}
          readOnly
          className="border rounded p-2 bg-gray-100"
        />
        <select
          value={form.type}
          onChange={e => handleChange('type', e.target.value as ServiceType)}
          className="border rounded p-2"
        >
          <option value="planned">Planned</option>
          <option value="unplanned">Unplanned</option>
          <option value="emergency">Emergency</option>
        </select>
        <textarea
          placeholder="Description"
          value={form.serviceDescription}
          onChange={e => handleChange('serviceDescription', e.target.value)}
          className="border rounded p-2"
        />
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-500">{status}</span>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white rounded p-2"
        >
          Create Service Log
        </button>
      </div>
    </div>
  );
};
