import React, { useState, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useDispatch } from 'react-redux';
import { updateLog } from '../redux/slices/logsSlice';
import { ServiceLog, ServiceType } from '../types';

interface EditLogModalProps {
  log: ServiceLog;
  onClose: () => void;
}

export const EditLogModal: React.FC<EditLogModalProps> = ({ log, onClose }) => {
  const dispatch = useDispatch();
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    ...log,
    odometer:
      log.odometer !== null && log.odometer !== undefined ? log.odometer.toString() : '0',
    engineHours:
      log.engineHours !== null && log.engineHours !== undefined
        ? log.engineHours.toString()
        : '0',
  });

  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setForm({
      ...log,
      odometer:
        log.odometer !== null && log.odometer !== undefined
          ? log.odometer.toString()
          : '0',
      engineHours:
        log.engineHours !== null && log.engineHours !== undefined
          ? log.engineHours.toString()
          : '0',
    });
    setTimeout(() => firstInputRef.current?.focus(), 0);
  }, [log]);

  const handleChange = (key: keyof typeof form, value: any) => {
    if (key === 'startDate') {
      const newEndDate = new Date(new Date(value).getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      setForm({ ...form, startDate: value, endDate: newEndDate });
    } else {
      setForm({ ...form, [key]: value });
    }
  };

  const handleSave = () => {
    if (!form.odometer || !form.engineHours) {
      alert('Odometer and Engine Hours are required!');
      return;
    }

    dispatch(
      updateLog({
        ...form,
        odometer: Number(form.odometer),
        engineHours: Number(form.engineHours),
      })
    );

    setMessage('Service log updated!');
    setTimeout(() => {
      setMessage(null);
      onClose();
    }, 2000);
  };

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed inset-0 bg-black/30" />
      <Dialog.Content className="fixed top-1/2 left-1/2 bg-white p-6 rounded shadow -translate-x-1/2 -translate-y-1/2 w-96">
        <Dialog.Title className="text-lg font-bold mb-4">Edit Service Log</Dialog.Title>

        {message && (
          <div className="bg-green-500 text-white p-2 rounded mb-2 text-center">
            {message}
          </div>
        )}

        <input
          ref={firstInputRef}
          placeholder="Provider ID"
          value={form.providerId}
          onChange={e => handleChange('providerId', e.target.value)}
          className="border rounded p-2 mb-2 w-full"
        />
        <input
          placeholder="Service Order"
          value={form.serviceOrder}
          onChange={e => handleChange('serviceOrder', e.target.value)}
          className="border rounded p-2 mb-2 w-full"
        />
        <input
          placeholder="Car ID"
          value={form.carId}
          onChange={e => handleChange('carId', e.target.value)}
          className="border rounded p-2 mb-2 w-full"
        />
        <input
          type="number"
          placeholder="Odometer"
          value={form.odometer}
          onChange={e => handleChange('odometer', e.target.value)}
          className="border rounded p-2 mb-2 w-full"
        />
        <input
          type="number"
          placeholder="Engine Hours"
          value={form.engineHours}
          onChange={e => handleChange('engineHours', e.target.value)}
          className="border rounded p-2 mb-2 w-full"
        />
        <input
          type="date"
          value={form.startDate}
          onChange={e => handleChange('startDate', e.target.value)}
          className="border rounded p-2 mb-2 w-full"
        />
        <input
          type="date"
          value={form.endDate}
          readOnly
          className="border rounded p-2 mb-2 w-full bg-gray-100"
        />
        <select
          value={form.type}
          onChange={e => handleChange('type', e.target.value as ServiceType)}
          className="border rounded p-2 mb-2 w-full"
        >
          <option value="planned">Planned</option>
          <option value="unplanned">Unplanned</option>
          <option value="emergency">Emergency</option>
        </select>
        <textarea
          placeholder="Description"
          value={form.serviceDescription}
          onChange={e => handleChange('serviceDescription', e.target.value)}
          className="border rounded p-2 mb-2 w-full"
        />

        <div className="flex justify-end gap-2 mt-2">
          <button className="bg-gray-400 text-white rounded p-2" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-blue-500 text-white rounded p-2" onClick={handleSave}>
            Save
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
