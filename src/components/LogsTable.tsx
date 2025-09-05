import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { EditLogModal } from './EditLogModal';
import { DeleteLogModal } from './DeleteLogModal';

export const LogsTable: React.FC = () => {
  const logs = useSelector((state: RootState) => state.logs.logs);

  // Состояние для редактирования и удаления
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Поиск и фильтры
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [startDateFrom, setStartDateFrom] = useState('');
  const [startDateTo, setStartDateTo] = useState('');

  // Фильтруем логи
  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.providerId.includes(search) ||
      log.serviceOrder.includes(search) ||
      log.carId.includes(search);

    const matchesType = typeFilter === 'all' ? true : log.type === typeFilter;

    const logDate = new Date(log.startDate);
    const fromDate = startDateFrom ? new Date(startDateFrom) : null;
    const toDate = startDateTo ? new Date(startDateTo) : null;

    const matchesDate =
      (!fromDate || logDate >= fromDate) && (!toDate || logDate <= toDate);

    return matchesSearch && matchesType && matchesDate;
  });

  return (
    <>
      {/* Поиск и фильтры */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded p-2"
        />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All Types</option>
          <option value="planned">Planned</option>
          <option value="unplanned">Unplanned</option>
          <option value="emergency">Emergency</option>
        </select>
        <input
          type="date"
          value={startDateFrom}
          onChange={e => setStartDateFrom(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="date"
          value={startDateTo}
          onChange={e => setStartDateTo(e.target.value)}
          className="border rounded p-2"
        />
      </div>

      {/* Таблица */}
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th>Provider</th>
            <th>Service Order</th>
            <th>Car</th>
            <th>Odometer</th>
            <th>Engine Hours</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map(log => (
            <tr key={log.id} className="border-t">
              <td>{log.providerId}</td>
              <td>{log.serviceOrder}</td>
              <td>{log.carId}</td>
              <td>{log.odometer}</td>
              <td>{log.engineHours}</td>
              <td>{log.type}</td>
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

      {/* Модалка редактирования */}
      {editId && (
        <EditLogModal
          log={logs.find(log => log.id === editId)!}
          onClose={() => setEditId(null)}
        />
      )}

      {/* Модалка удаления */}
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
