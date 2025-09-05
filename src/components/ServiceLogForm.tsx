import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { RootState, AppDispatch } from '../store'
import { upsertDraft, removeDraft } from '../slices/draftsSlice'
import { addLog } from '../slices/logsSlice'
import { Draft, ServiceLog } from '../types'

function isoDateAddDays(base: string, days: number) {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export default function ServiceLogForm() {
  const dispatch = useDispatch<AppDispatch>()
  const drafts = useSelector((s: RootState) => s.drafts.items)

  const [local, setLocal] = useState<Draft>(() => {
    const today = new Date().toISOString().slice(0, 10)
    return {
      draftId: uuidv4(),
      providerId: '',
      serviceOrder: '',
      carId: '',
      odometer: null,
      engineHours: null,
      startDate: today,
      endDate: isoDateAddDays(today, 1),
      type: 'planned',
      serviceDescription: '',
      isSaved: false,
    }
  })

  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  useEffect(() => {
    setLocal(prev => {
        const newEnd = isoDateAddDays(prev.startDate, 1)
        if (prev.endDate !== newEnd) {
        return { ...prev, endDate: newEnd }
        }
        return prev
    })
  }, [local.startDate])

  useEffect(() => {
    setStatus('saving')
    const t = setTimeout(() => {
      dispatch(upsertDraft(local))
      setStatus('saved')
      setLocal(prev => ({ ...prev, isSaved: true }))
    }, 500)
    return () => clearTimeout(t)
  }, [local, dispatch])

  const createLog = () => {
    const log: ServiceLog = {
      id: uuidv4(),
      providerId: local.providerId,
      serviceOrder: local.serviceOrder,
      carId: local.carId,
      odometer: local.odometer,
      engineHours: local.engineHours,
      startDate: local.startDate,
      endDate: local.endDate,
      type: local.type,
      serviceDescription: local.serviceDescription,
      createdAt: new Date().toISOString(),
    }
    dispatch(addLog(log))
    dispatch(removeDraft({ draftId: local.draftId }))
    const today = new Date().toISOString().slice(0, 10)
    setLocal({
      draftId: uuidv4(),
      providerId: '',
      serviceOrder: '',
      carId: '',
      odometer: null,
      engineHours: null,
      startDate: today,
      endDate: isoDateAddDays(today, 1),
      type: 'planned',
      serviceDescription: '',
      isSaved: false,
    })
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Create Service Log (Draft)</h2>
        <div className="text-sm text-slate-500">
          {status === 'saving' ? 'Saving...' : 'Draft saved'}
        </div>
      </div>

      <div className="space-y-3">
        <input
          className="w-full p-2 border rounded"
          placeholder="Provider ID"
          value={local.providerId}
          onChange={e => setLocal({ ...local, providerId: e.target.value })}
        />

        <input
          className="w-full p-2 border rounded"
          placeholder="Service Order"
          value={local.serviceOrder}
          onChange={e => setLocal({ ...local, serviceOrder: e.target.value })}
        />

        <input
          className="w-full p-2 border rounded"
          placeholder="Car ID"
          value={local.carId}
          onChange={e => setLocal({ ...local, carId: e.target.value })}
        />

        <input
          className="w-full p-2 border rounded"
          type="number"
          placeholder="Odometer (mi)"
          value={local.odometer ?? ''}
          onChange={e =>
            setLocal({
              ...local,
              odometer: e.target.value === '' ? null : Number(e.target.value),
            })
          }
        />

        <input
          className="w-full p-2 border rounded"
          type="number"
          placeholder="Engine Hours"
          value={local.engineHours ?? ''}
          onChange={e =>
            setLocal({
              ...local,
              engineHours: e.target.value === '' ? null : Number(e.target.value),
            })
          }
        />

        <label className="block">
          <div className="text-sm">Start Date</div>
          <input
            className="w-full p-2 border rounded"
            type="date"
            value={local.startDate}
            onChange={e => setLocal({ ...local, startDate: e.target.value })}
          />
        </label>

        <label className="block">
          <div className="text-sm">End Date</div>
          <input
            className="w-full p-2 border rounded"
            type="date"
            value={local.endDate}
            onChange={e => setLocal({ ...local, endDate: e.target.value })}
          />
        </label>

        <select
          className="w-full p-2 border rounded"
          value={local.type}
          onChange={e => setLocal({ ...local, type: e.target.value as any })}
        >
          <option value="planned">Planned</option>
          <option value="unplanned">Unplanned</option>
          <option value="emergency">Emergency</option>
        </select>

        <textarea
          className="w-full p-2 border rounded"
          placeholder="Service Description"
          value={local.serviceDescription}
          onChange={e =>
            setLocal({ ...local, serviceDescription: e.target.value })
          }
        />

        <div className="flex gap-2">
          <button
            className="px-3 py-2 bg-blue-600 text-white rounded"
            onClick={createLog}
          >
            Create Service Log
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium">Local Drafts ({drafts.length})</h3>
        <ul className="text-sm mt-2">
          {drafts.map(d => (
            <li key={d.draftId} className="flex justify-between border-b py-2">
              <div>
                {d.serviceOrder || (
                  <span className="text-slate-400">(no order)</span>
                )}
              </div>
              <div className="text-green-600">
                {d.isSaved ? 'Saved' : 'Unsaved'}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
