import React, { useState, useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '../redux/store';
import { ServiceType } from '../types/index';

export const LogsTable: React.FC = () => {
  const logs = useSelector((state: RootState) => state.logs.logs ?? [], shallowEqual);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<ServiceType | 'all'>('all');
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({ start: '', end: '' });

  const filteredLogs = useMemo(() => logs.filter(log => {
    const matchesSearch =
      log.providerId.includes(search) ||
      log.serviceOrder.includes(search) ||
      log.carId.includes(search);

    const matchesType = filterType === 'all' || log.type === filterType;

    const matchesDate =
      (!dateRange.start || log.startDate >= dateRange.start) &&
      (!dateRange.end || log.endDate <= dateRange.end);

    return matchesSearch && matchesType && matchesDate;
  }), [logs, search, filterType, dateRange]);

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-xl font-bold mb-4">Service Logs</h2>
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded p-2 flex-1"
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value as ServiceType | 'all')}
          className="border rounded p-2"
        >
          <option value="all">All</option>
          <option value="planned">Planned</option>
          <option value="unplanned">Unplanned</option>
          <option value="emergency">Emergency</option>
        </select>
        <input
          type="date"
          value={dateRange.start}
          onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
          className="border rounded p-2"
        />
        <input
          type="date"
          value={dateRange.end}
          onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
          className="border rounded p-2"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Provider ID</th>
              <th className="border p-2 text-left">Service Order</th>
              <th className="border p-2 text-left">Car ID</th>
              <th className="border p-2 text-left">Odometer</th>
              <th className="border p-2 text-left">Engine Hours</th>
              <th className="border p-2 text-left">Start Date</th>
              <th className="border p-2 text-left">End Date</th>
              <th className="border p-2 text-left">Type</th>
              <th className="border p-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length ? filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="border p-2">{log.providerId}</td>
                <td className="border p-2">{log.serviceOrder}</td>
                <td className="border p-2">{log.carId}</td>
                <td className="border p-2">{log.odometer}</td>
                <td className="border p-2">{log.engineHours}</td>
                <td className="border p-2">{log.startDate}</td>
                <td className="border p-2">{log.endDate}</td>
                <td className="border p-2">{log.type}</td>
                <td className="border p-2">{log.serviceDescription}</td>
              </tr>
            )) : (
              <tr>
                <td className="p-2 text-center" colSpan={9}>No logs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
