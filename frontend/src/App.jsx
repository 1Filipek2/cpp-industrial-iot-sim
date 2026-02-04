import { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  Activity, Thermometer, Droplets, Trash2, Github, Clock, ChevronRight, AlertTriangle
} from 'lucide-react'

axios.defaults.baseURL = 'https://iot-backend-filip.onrender.com';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border border-zinc-700 px-3 py-2 text-xs font-mono text-zinc-200 shadow-xl">
        <div className="mb-1 text-zinc-500 text-[10px]">{payload[0].payload.fullDate}</div>
        <div className="text-zinc-100 font-bold">{payload[0].value.toFixed(2)}</div>
      </div>
    )
  }
  return null
}

function App() {
  const [alarms, setAlarms] = useState([])
  const [stats, setStats] = useState({ maxTemp: 0, alertCount: 0, avgPressure: 0 })
  const [loading, setLoading] = useState(true)

  const wakeUpServer = useCallback(async () => {
    try {
      await axios.get('/api/ping');
      console.log("System_Status: Connection_Established");
    } catch {
      console.log("System_Status: Waking_UP_Backend..");
    }
  }, []);

  const fetchAlarms = useCallback(async () => {
    try {
      const res = await axios.get('/api/alarms')
      setAlarms(res.data)
      setLoading(false)
    } catch {
      console.error("Fetch_Error: Backend is likely sleeping.");
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get('/api/stats')
      setStats(res.data)
    } catch {
      console.log("Stats_Error: Waiting for data...");
    }
  }, []);

  const latestAlarms = useMemo(() => {
    return [...alarms].slice(0, 20)
  }, [alarms])

  const chartData = useMemo(() => {
    return [...latestAlarms].reverse().map(a => ({
      time: new Date(a.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      value: a.value,
      fullDate: new Date(a.timestamp).toLocaleString('en-GB')
    }))
  }, [latestAlarms])

  const handleClear = async () => {
    const key = window.prompt('Enter Admin Key:')
    if (!key) return
    try {
      await axios.delete('/api/alarms', { headers: { 'x-api-key': key } })
      fetchAlarms()
      fetchStats()
    } catch {
      alert('Unauthorized access attempt logged.')
    }
  }

  useEffect(() => {
    const initSystem = async () => {
      wakeUpServer();
      await fetchAlarms();
      fetchStats();
    };

    initSystem();

    const interval = setInterval(() => {
      fetchAlarms();
      fetchStats();
    }, 5000)

    return () => clearInterval(interval)
  }, [wakeUpServer, fetchAlarms, fetchStats])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 text-sm font-mono tracking-widest animate-pulse">
        LOADING_SYSTEM_DATA...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-mono selection:bg-zinc-800">
      <header className="border-b border-zinc-800 sticky top-0 bg-black/90 backdrop-blur-sm z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
          <h1 className="text-xs tracking-[0.3em] text-zinc-100 font-medium uppercase">Industrial Monitor</h1>
          <button onClick={handleClear} className="p-2 text-zinc-500 hover:text-red-500 transition-all">
            <Trash2 size={16} />
          </button>
        </div>
      </header>

      <div className="border-b border-zinc-900 bg-zinc-900/10">
        <div className="max-w-5xl mx-auto px-4 py-2 flex justify-center">
          <a 
            href="https://github.com/1Filipek2/cpp-industrial-iot-sim" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[9px] text-zinc-600 hover:text-zinc-100 transition-colors group"
          >
            <Github size={12} className="group-hover:rotate-12 transition-transform" />
            <span className="tracking-widest uppercase">VIEW SOURCE CODE & README</span>
          </a>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-zinc-800 bg-zinc-900/10 p-4 rounded-sm flex items-center justify-between group hover:border-zinc-700 transition-colors">
            <div>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Peak Temp (24h)</p>
              <p className="text-xl font-bold text-zinc-100 font-mono">
                {stats.maxTemp.toFixed(1)}<span className="text-zinc-600 text-xs ml-1">°C</span>
              </p>
            </div>
            <div className="p-2 bg-red-950/20 rounded-full">
              <Thermometer size={18} className="text-red-500" />
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-900/10 p-4 rounded-sm flex items-center justify-between group hover:border-zinc-700 transition-colors">
            <div>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Alerts Today</p>
              <p className="text-xl font-bold text-zinc-100 font-mono">
                {stats.alertCount}
              </p>
            </div>
            <div className="p-2 bg-amber-950/20 rounded-full">
              <AlertTriangle size={18} className="text-amber-500" />
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-900/10 p-4 rounded-sm flex items-center justify-between group hover:border-zinc-700 transition-colors">
            <div>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Avg Pressure</p>
              <p className="text-xl font-bold text-zinc-100 font-mono">
                {stats.avgPressure.toFixed(2)}<span className="text-zinc-600 text-xs ml-1">BAR</span>
              </p>
            </div>
            <div className="p-2 bg-blue-950/20 rounded-full">
              <Droplets size={18} className="text-blue-400" />
            </div>
          </div>
        </section>

        <section className="border border-zinc-800 bg-zinc-900/5 p-5 rounded-sm">
          <div className="flex items-center justify-between mb-6">
            <span className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold tracking-widest uppercase">
              <Activity size={14} className="text-zinc-600" /> Signal Trend
            </span>
            <span className="text-[9px] text-zinc-700 uppercase">Sync_Active</span>
          </div>
          <div className="h-60 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="time" stroke="#444" fontSize={9} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#444" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#666" fill="#111" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] text-zinc-500 tracking-[0.2em] font-bold uppercase flex items-center gap-2">
              <ChevronRight size={12} className="text-red-900" /> Event Log (Last 20)
            </h2>
            <span className="text-[9px] text-zinc-700 font-mono tracking-tighter uppercase">Status: Live</span>
          </div>

          <div className="hidden md:block overflow-hidden border border-zinc-800 rounded-sm">
            <table className="w-full text-[11px]">
              <thead className="bg-zinc-900/50 text-zinc-600 border-b border-zinc-800">
                <tr>
                  <th className="px-5 py-3 text-left uppercase tracking-widest">Sensor</th>
                  <th className="px-5 py-3 text-left uppercase tracking-widest">Value</th>
                  <th className="px-5 py-3 text-left uppercase tracking-widest">Timestamp</th>
                  <th className="px-5 py-3 text-right uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {latestAlarms.map(alarm => (
                  <tr key={alarm._id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-5 py-3 text-zinc-400 uppercase">
                      <div className="flex items-center gap-3">
                        {alarm.sensor.includes('Boiler') ? <Thermometer size={14} /> : <Droplets size={14} />}
                        {alarm.sensor}
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono">
                      <span className="text-zinc-200 font-bold">{alarm.value.toFixed(2)}</span>
                      <span className="text-zinc-600 ml-1 text-[9px]">{alarm.sensor.includes('Boiler') ? '°C' : 'BAR'}</span>
                    </td>
                    <td className="px-5 py-3 text-zinc-500">{new Date(alarm.timestamp).toLocaleString('en-GB')}</td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-red-500 font-bold text-[10px] px-2 py-0.5 border border-red-900/10 uppercase bg-red-950/5">
                        {alarm.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {latestAlarms.map(alarm => (
              <div key={alarm._id} className="border border-zinc-800 bg-zinc-950 p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {alarm.sensor.includes('Boiler') ? (
                      <Thermometer size={14} className="text-zinc-600" />
                    ) : (
                      <Droplets size={14} className="text-zinc-600" />
                    )}
                    <span className="text-[10px] font-bold text-zinc-300 uppercase">{alarm.sensor}</span>
                  </div>
                  <span className="text-[9px] text-red-500 font-bold border border-red-900/30 px-2 py-0.5 bg-red-950/10 uppercase">
                    {alarm.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-zinc-900/50 pt-3">
                  <div>
                    <p className="text-[8px] text-zinc-600 uppercase mb-0.5 tracking-tighter">Measurement</p>
                    <p className="text-xs font-bold text-zinc-200 font-mono">
                      {alarm.value.toFixed(2)}
                      <span className="text-zinc-600 ml-1 text-[9px]">{alarm.sensor.includes('Boiler') ? '°C' : 'BAR'}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-zinc-600 uppercase mb-0.5 tracking-tighter">Event Time</p>
                    <p className="text-[9px] text-zinc-500 tabular-nums flex items-center justify-end gap-1">
                      <Clock size={10} /> {new Date(alarm.timestamp).toLocaleTimeString('en-GB')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {latestAlarms.length === 0 && (
            <div className="py-20 text-center border border-dashed border-zinc-900">
              <p className="text-[10px] text-zinc-800 tracking-[0.4em] uppercase">Null Data Stream</p>
            </div>
          )}
        </section>
      </main>

      <footer className="max-w-5xl mx-auto px-8 py-10 border-t border-zinc-950 text-[9px] text-zinc-800 flex flex-col sm:flex-row justify-between gap-4">
        <p className="tracking-widest uppercase">Industrial_Interface_v1.1</p>
        <p className="font-mono italic uppercase">Filip Rybakov | findo-dev.me</p>
      </footer>
    </div>
  )
}

export default App