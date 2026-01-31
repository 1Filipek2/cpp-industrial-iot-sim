import { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  Activity, Thermometer, Droplets, Trash2, Github
} from 'lucide-react'

axios.defaults.baseURL = 'https://iot-backend-filip.onrender.com';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border border-zinc-700 px-3 py-2 text-xs font-mono text-zinc-200">
        <div className="mb-1 text-zinc-500">{payload[0].payload.fullDate}</div>
        <div>{payload[0].value.toFixed(2)}</div>
      </div>
    )
  }
  return null
}

function App() {
  const [alarms, setAlarms] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAlarms = useCallback(async () => {
    try {
      const res = await axios.get('/api/alarms')
      setAlarms(res.data)
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }, [])

  const chartData = useMemo(() => {
    return [...alarms].slice(0, 20).reverse().map(a => ({
      time: new Date(a.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      value: a.value,
      fullDate: new Date(a.timestamp).toLocaleString('en-GB')
    }))
  }, [alarms])

  const handleClear = async () => {
    const key = window.prompt('Enter Admin API Key:')
    if (!key) return
    try {
      await axios.delete('/api/alarms', { headers: { 'x-api-key': key } })
      fetchAlarms()
    } catch {
      alert('Unauthorized access attempt logged.')
    }
  }

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await axios.get('/api/alarms')
        if (mounted) {
          setAlarms(res.data)
          setLoading(false)
        }
      } catch {
        if (mounted) setLoading(false)
      }
    }
    load()
    const interval = setInterval(fetchAlarms, 5000)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [fetchAlarms])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 text-sm font-mono">
        loading data...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-mono">
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-sm tracking-widest text-zinc-100">INDUSTRIAL MONITOR</h1>
            <a 
              href="https://github.com/1Filipek2/cpp-industrial-iot-sim" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] text-zinc-500 hover:text-zinc-100 transition-colors border-l border-zinc-800 pl-6"
            >
              <Github size={14} />
              <span className="hidden sm:inline">VIEW SOURCE & README</span>
            </a>
          </div>
          <button onClick={handleClear} className="text-zinc-500 hover:text-red-500">
            <Trash2 size={16} />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <section className="border border-zinc-800 p-4">
          <div className="flex items-center justify-between mb-4 text-xs text-zinc-500">
            <span className="flex items-center gap-2 text-zinc-400">
              <Activity size={14} /> SIGNAL TREND
            </span>
            <span>LAST 20 ENTRIES</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="time" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#888"
                  fill="#222"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="border border-zinc-800">
          <div className="px-4 py-3 border-b border-zinc-800 text-xs text-zinc-500 tracking-widest">
            EVENT LOG
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-zinc-600 border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-2 text-left">SENSOR</th>
                  <th className="px-4 py-2 text-left">VALUE</th>
                  <th className="px-4 py-2 text-left">TIME</th>
                  <th className="px-4 py-2 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {alarms.map(alarm => (
                  <tr key={alarm._id} className="hover:bg-zinc-900/40">
                    <td className="px-4 py-3 flex items-center gap-2 text-zinc-300">
                      {alarm.sensor.includes('Boiler') ? (
                        <Thermometer size={14} className="text-zinc-500" />
                      ) : (
                        <Droplets size={14} className="text-zinc-500" />
                      )}
                      {alarm.sensor}
                    </td>
                    <td className="px-4 py-3 text-zinc-100">
                      {alarm.value.toFixed(2)}{' '}
                      <span className="text-zinc-500">
                        {alarm.sensor.includes('Boiler') ? 'C' : 'BAR'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {new Date(alarm.timestamp).toLocaleString('en-GB')}
                    </td>
                    <td className="px-4 py-3 text-right text-red-500">
                      {alarm.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {alarms.length === 0 && (
              <div className="py-16 text-center text-zinc-600 text-xs">
                no records
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App