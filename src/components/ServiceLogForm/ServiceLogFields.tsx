import React from 'react';
import { ServiceType } from '../../types';

interface ServiceLogFieldsProps {
  formData: {
    providerId: string;
    serviceOrder: string;
    carId: string;
    odometer: number;
    engineHours: number;
    startDate: string;
    endDate: string;
    type: ServiceType;
    serviceDescription: string;
  };
  errors: Record<string, string>;
  onChange: (key: keyof ServiceLogFieldsProps['formData'], value: any) => void;
}

export const ServiceLogFields: React.FC<ServiceLogFieldsProps> = ({
  formData,
  errors,
  onChange,
}) => {
  const inputClass = (field: string) =>
    `border rounded p-2 ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;

  return (
    <>
      <input
        placeholder="Provider ID"
        value={formData.providerId}
        onChange={e => onChange('providerId', e.target.value)}
        className={inputClass('providerId')}
      />
      {errors.providerId && <span className="text-red-500 text-sm">{errors.providerId}</span>}

      <input
        placeholder="Service Order"
        value={formData.serviceOrder}
        onChange={e => onChange('serviceOrder', e.target.value)}
        className={inputClass('serviceOrder')}
      />
      {errors.serviceOrder && <span className="text-red-500 text-sm">{errors.serviceOrder}</span>}

      <input
        placeholder="Car ID"
        value={formData.carId}
        onChange={e => onChange('carId', e.target.value)}
        className={inputClass('carId')}
      />
      {errors.carId && <span className="text-red-500 text-sm">{errors.carId}</span>}

      <input
        type="number"
        placeholder="Odometer"
        value={formData.odometer}
        onChange={e => onChange('odometer', Number(e.target.value))}
        className={inputClass('odometer')}
      />
      {errors.odometer && <span className="text-red-500 text-sm">{errors.odometer}</span>}

      <input
        type="number"
        placeholder="Engine Hours"
        value={formData.engineHours}
        onChange={e => onChange('engineHours', Number(e.target.value))}
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
          onChange('startDate', newStart);
          onChange('endDate', newEnd);
        }}
        className={inputClass('startDate')}
      />
      {errors.startDate && <span className="text-red-500 text-sm">{errors.startDate}</span>}

      <input
        type="date"
        value={formData.endDate}
        onChange={e => onChange('endDate', e.target.value)}
        className={inputClass('endDate')}
      />
      {errors.endDate && <span className="text-red-500 text-sm">{errors.endDate}</span>}

      <select
        value={formData.type}
        onChange={e => onChange('type', e.target.value as ServiceType)}
        className={inputClass('type')}
      >
        <option value="planned">Planned</option>
        <option value="unplanned">Unplanned</option>
        <option value="emergency">Emergency</option>
      </select>

      <textarea
        placeholder="Service Description"
        value={formData.serviceDescription}
        onChange={e => onChange('serviceDescription', e.target.value)}
        className={inputClass('serviceDescription')}
      />
      {errors.serviceDescription && (
        <span className="text-red-500 text-sm">{errors.serviceDescription}</span>
      )}
    </>
  );
};
