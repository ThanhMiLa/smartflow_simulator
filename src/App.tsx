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
  const [config, setConfig] = useState<SystemConfig>({ x: 2, distance: 500, speed: 50 });
  const [travelingPlatoons, setTravelingPlatoons] = useState<Platoon[]>([]);

  const addLog = (msg: string, type: LogType = 'info') => {
    setLogs(prev => [{ id: Date.now() + Math.random(), time: new Date().toLocaleTimeString('vi-VN', { hour12: false }), msg, type }, ...prev].slice(0, 100));
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

  const handleTestCase = (testCase: number, cars: number) => {
    addLog(`--- BẮT ĐẦU TEST KỊCH BẢN ${testCase} ---`, 'info');
    
    // Đặt trạng thái A luôn chuẩn bị xuất phát
    nodeA.forceState('GREEN', 20);
    
    // Ép trạng thái B theo kịch bản để test
    if (testCase === 1) {
      nodeB.forceState('RED', 60); // Đỏ đang đếm, còn nhiều hơn 36s
    } else if (testCase === 2) {
      nodeB.forceState('RED', 15); // Đỏ sắp hết, còn ít hơn 36s
    } else if (testCase === 3) {
      nodeB.forceState('GREEN', 30); // Đang xanh (lệch nhịp hoàn toàn)
    }

    // Đợi 1 giây để UI cập nhật rồi xuất phát xe
    setTimeout(() => {
      addLog(`[NODE A] Đèn xanh, đoàn xe ${cars} chiếc xuất phát đi tới B.`, 'success');
      setTravelingPlatoons(prev => [...prev, { id: Date.now(), count: cars, remaining: OFFSET }]);
      nodeB.applyCoordination(OFFSET, Math.round(cars / config.x));
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/10 mb-8 shadow-lg shadow-black/20">
           <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-3">
             <Zap className="text-cyan-400" /> SMARTFLOW SIMULATOR
           </h1>
           <div className="flex items-center gap-6 text-xs font-bold uppercase text-slate-400">
             <div className="flex flex-col items-end">
                <span>Hệ số giảm trừ: x = {config.x}</span>
                <input 
                  type="range" min="1" max="4" value={config.x} 
                  onChange={(e) => setConfig({...config, x: Number(e.target.value)})}
                  className="w-32 mt-1 accent-cyan-500" 
                />
             </div>
             <span className="text-emerald-400 text-base bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">Offset: {OFFSET}s</span>
           </div>
        </header>

        {/* Sa bàn */}
        <div className="bg-slate-800/50 rounded-3xl p-12 mb-8 border border-white/5 relative shadow-inner overflow-hidden">
          <div className="flex justify-between items-center relative">
            <Intersection name="NGÃ TƯ A" light={nodeA.light} timer={nodeA.timer} />
            <Road platoons={travelingPlatoons} offset={OFFSET} />
            <Intersection name="NGÃ TƯ B" light={nodeB.light} timer={nodeB.timer} isAI />
          </div>
        </div>

        <Dashboard logs={logs} onTestCase={handleTestCase} />
      </div>
    </div>
  );
}