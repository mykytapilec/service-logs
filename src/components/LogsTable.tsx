import React, { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../store'
import { removeLog } from '../slices/logsSlice'

export default function LogsTable() {
  const logs = useSelector((s: RootState) => s.logs.items)
  const dispatch = useDispatch<AppDispatch>()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'planned' | 'unplanned' | 'emergency'>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filtered = useMemo(() => {
    return logs.filter(log => {
      const haystack = [log.providerId, log.serviceOrder, log.carId].join(' ').toLowerCase()
      if (search && !haystack.includes(search.toLowerCase())) return false

      if (typeFilter !== 'all' && log.type !== typeFilter) return false

      if (dateFrom && log.startDate < dateFrom) return false
      if (dateTo && log.startDate > dateTo) return false

      return true
    })
  }, [logs, search, typeFilter, dateFrom, dateTo])

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          className="border p-2 rounded flex-1"
          placeholder="Search by provider/order/car"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as any)}
        >
          <option value="all">All types</option>
          <option value="planned">Planned</option>
          <option value="unplanned">Unplanned</option>
          <option value="emergency">Emergency</option>
        </select>

        <input
          type="date"
          className="border p-2 rounded"
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
        />
      </div>

      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-2 border">Provider</th>
            <th className="p-2 border">Order</th>
            <th className="p-2 border">Car</th>
            <th className="p-2 border">Start</th>
            <th className="p-2 border">End</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(log => (
            <tr key={log.id} className="hover:bg-slate-50">
              <td className="p-2 border">{log.providerId}</td>
              <td className="p-2 border">{log.serviceOrder}</td>
              <td className="p-2 border">{log.carId}</td>
              <td className="p-2 border">{log.startDate}</td>
              <td className="p-2 border">{log.endDate}</td>
              <td className="p-2 border capitalize">{log.type}</td>
              <td className="p-2 border">
                <div className="flex gap-2">
                  <button className="text-blue-600 text-xs">Edit</button>
                  <button
                    className="text-red-600 text-xs"
                    onClick={() => dispatch(removeLog({ id: log.id }))}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={7} className="p-4 text-center text-slate-500">
                No logs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
