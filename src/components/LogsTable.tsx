import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { EditLogModal } from './EditLogModal';
import { DeleteLogModal } from './DeleteLogModal';

export const LogsTable: React.FC = () => {
  const logs = useSelector((state: RootState) => state.logs.logs);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th>Provider</th>
            <th>Service Order</th>
            <th>Car</th>
            <th>Odometer</th>
            <th>Engine Hours</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id} className="border-t">
              <td>{log.providerId}</td>
              <td>{log.serviceOrder}</td>
              <td>{log.carId}</td>
              <td>{log.odometer}</td>
              <td>{log.engineHours}</td>
              <td className="flex gap-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => setEditId(log.id)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => setDeleteId(log.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editId && (
        <EditLogModal
          log={logs.find(log => log.id === editId)!}
          onClose={() => setEditId(null)}
        />
      )}

      {deleteId && (
        <DeleteLogModal
          logId={deleteId}
          open={Boolean(deleteId)}
          onClose={() => setDeleteId(null)}
        />
      )}
    </>
  );
};
