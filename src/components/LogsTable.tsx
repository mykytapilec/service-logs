import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { ServiceLog } from '../types';
import { EditLogModal } from './EditLogModal';

export const LogsTable: React.FC = () => {
  const logs = useSelector((state: RootState) => state.logs.logs);
  const [selectedLog, setSelectedLog] = useState<ServiceLog | null>(null);

  return (
    <div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Provider</th>
            <th className="border p-2">Order</th>
            <th className="border p-2">Car ID</th>
            <th className="border p-2">Odometer</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td className="border p-2">{log.providerId}</td>
              <td className="border p-2">{log.serviceOrder}</td>
              <td className="border p-2">{log.carId}</td>
              <td className="border p-2">{log.odometer}</td>
              <td className="border p-2">{log.type}</td>
              <td className="border p-2">
                <button
                  className="bg-yellow-400 text-white rounded p-1"
                  onClick={() => setSelectedLog(log)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedLog && (
        <EditLogModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
};
