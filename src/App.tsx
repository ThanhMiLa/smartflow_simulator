import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { useTrafficLogic } from './hooks/useTrafficLogic';
import { Intersection } from './components/Intersection';
import { Road } from './components/Road';
import { Dashboard } from './components/Dashboard';
import type { LogEntry, LogType, Platoon, SystemConfig } from './types';

const OFFSET = 36;

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [config] = useState<SystemConfig>({ x: 2, distance: 500, speed: 50 });
  const [travelingPlatoons, setTravelingPlatoons] = useState<Platoon[]>([]);

  const addLog = (msg: string, type: LogType = 'info') => {
    setLogs(prev => [{ id: Date.now() + Math.random(), time: new Date().toLocaleTimeString('vi-VN', { hour12: false }), msg, type }, ...prev].slice(0, 50));
  };

  const nodeA = useTrafficLogic('GREEN', 22, 'NODE A', addLog);
  const nodeB = useTrafficLogic('RED', 50, 'NODE B', addLog);

  // Đồng bộ xe chạy
  useEffect(() => {
    const timer = setInterval(() => {
      setTravelingPlatoons(prev => prev.map(p => ({ ...p, remaining: p.remaining - 1 })).filter(p => p.remaining > 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTrigger = (K: number) => {
    addLog(`[NODE A] Đèn xanh, đoàn xe ${K} chiếc xuất phát.`, 'success');
    setTravelingPlatoons(prev => [...prev, { id: Date.now(), count: K, remaining: OFFSET }]);
    nodeB.applyCoordination(OFFSET, Math.round(K / config.x));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/10 mb-8">
           <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-3">
             <Zap className="text-cyan-400" /> SMARTFLOW SIMULATOR
           </h1>
           <div className="flex gap-4 text-xs font-bold uppercase text-slate-400">
             <span>x = {config.x}</span>
             <span className="text-emerald-400">Offset: {OFFSET}s</span>
           </div>
        </header>

        {/* Sa bàn */}
        <div className="bg-slate-800/50 rounded-3xl p-12 mb-8 border border-white/5 relative shadow-inner">
          <div className="flex justify-between items-center">
            <Intersection name="NGÃ TƯ A" light={nodeA.light} timer={nodeA.timer} />
            <Road platoons={travelingPlatoons} offset={OFFSET} />
            <Intersection name="NGÃ TƯ B" light={nodeB.light} timer={nodeB.timer} isAI />
          </div>
        </div>

        <Dashboard logs={logs} onTrigger={handleTrigger} />
      </div>
    </div>
  );
}