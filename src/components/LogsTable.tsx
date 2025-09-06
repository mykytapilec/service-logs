import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { EditLogModal } from './EditLogModal';
import { DeleteLogModal } from './DeleteLogModal';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { safeGet, safeSet } from '../utils/storage';

export const LogsTable: React.FC = () => {
  const logs = useSelector((state: RootState) => state.logs.logs);

  const [search, setSearch] = useState(() =>
    safeGet<string>('logs.search', '')
  );
  const debouncedSearch = useDebouncedValue(search, 300);

  const [typeFilter, setTypeFilter] = useState(() =>
    safeGet<string>('logs.typeFilter', 'all')
  );
  const [startDateFrom, setStartDateFrom] = useState(() =>
    safeGet<string>('logs.startDateFrom', '')
  );
  const [startDateTo, setStartDateTo] = useState(() =>
    safeGet<string>('logs.startDateTo', '')
  );

  const [sortField, setSortField] = useState<'startDate' | 'odometer' | null>(() =>
    safeGet<'startDate' | 'odometer' | null>('logs.sortField', null)
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'default'>(() =>
    safeGet<'asc' | 'desc' | 'default'>('logs.sortOrder', 'default')
  );

  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    safeSet('logs.search', search);
  }, [search]);

  useEffect(() => {
    safeSet('logs.typeFilter', typeFilter);
  }, [typeFilter]);

  useEffect(() => {
    safeSet('logs.startDateFrom', startDateFrom);
  }, [startDateFrom]);

  useEffect(() => {
    safeSet('logs.startDateTo', startDateTo);
  }, [startDateTo]);

  useEffect(() => {
    safeSet('logs.sortField', sortField);
    safeSet('logs.sortOrder', sortOrder);
  }, [sortField, sortOrder]);

  const toggleSort = (field: 'startDate' | 'odometer') => {
    if (sortField === field) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else if (sortOrder === 'desc') {
        setSortOrder('default');
        setSortField(null);
      } else setSortOrder('asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (field: 'startDate' | 'odometer') => {
    if (sortField !== field || sortOrder === 'default') return '⇅';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.providerId.includes(debouncedSearch) ||
      log.serviceOrder.includes(debouncedSearch) ||
      log.carId.includes(debouncedSearch);

    const matchesType = typeFilter === 'all' ? true : log.type === typeFilter;

    const logDate = log.startDate ? new Date(log.startDate) : null;
    const fromDate = startDateFrom ? new Date(startDateFrom) : null;
    const toDate = startDateTo ? new Date(startDateTo) : null;

    const matchesDate =
      (!fromDate || (logDate && logDate >= fromDate)) &&
      (!toDate || (logDate && logDate <= toDate));

    return matchesSearch && matchesType && matchesDate;
  });

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (!sortField || sortOrder === 'default') return 0;

    let aValue: string | number =
      a[sortField] !== null && a[sortField] !== undefined ? a[sortField]! : '';
    let bValue: string | number =
      b[sortField] !== null && b[sortField] !== undefined ? b[sortField]! : '';

    if (sortField === 'startDate') {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <>
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

      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th>Provider</th>
            <th>Service Order</th>
            <th>Car</th>
            <th>
              <button onClick={() => toggleSort('odometer')}>
                Odometer {renderSortIcon('odometer')}
              </button>
            </th>
            <th>Engine Hours</th>
            <th>
              <button onClick={() => toggleSort('startDate')}>
                Start Date {renderSortIcon('startDate')}
              </button>
            </th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedLogs.map(log => (
            <tr key={log.id} className="border-t">
              <td>{log.providerId}</td>
              <td>{log.serviceOrder}</td>
              <td>{log.carId}</td>
              <td>{log.odometer ?? '-'}</td>
              <td>{log.engineHours ?? '-'}</td>
              <td>{log.startDate ?? '-'}</td>
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
