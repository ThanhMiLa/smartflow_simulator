import { useState, useRef, useCallback } from 'react';
import { Zap } from 'lucide-react';
import { useTrafficLogic } from './hooks/useTrafficLogic';
import { SimulatorCanvas, type SimulatorRef } from './components/SimulatorCanvas';
import { Dashboard } from './components/Dashboard';
import type { LogEntry, LogType, SystemConfig } from './types';

const OFFSET = 36;

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [config, setConfig] = useState<SystemConfig>({ x: 2, distance: 500, speed: 50 });
  const simRef = useRef<SimulatorRef>(null);

  const addLog = useCallback((msg: string, type: LogType = 'info') => {
    setLogs(prev => [{ id: Date.now() + Math.random(), time: new Date().toLocaleTimeString('vi-VN', { hour12: false }), msg, type }, ...prev].slice(0, 100));
  }, []);

  const getWaitingCarsA = useCallback(() => {
    return simRef.current?.getWaitingCarsA() || 0;
  }, []);

  const getWaitingCarsB = useCallback(() => {
    return simRef.current?.getWaitingCarsB() || 0;
  }, []);

  const nodeA = useTrafficLogic('GREEN', 22, 'NODE A', addLog, getWaitingCarsA);
  const nodeB = useTrafficLogic('RED', 50, 'NODE B', addLog, getWaitingCarsB);

  const handleTestCase = (testCase: number, K: number) => {
    addLog(`--- BẮT ĐẦU TEST KỊCH BẢN ${testCase} ---`, 'info');
    
    // Gán kịch bản cho B
    if (testCase === 1) nodeB.forceState('RED', 60); 
    else if (testCase === 2) nodeB.forceState('RED', 15); 
    else if (testCase === 3) nodeB.forceState('GREEN', 30); 

    // Đưa A về Đỏ 3s để gom K xe lại
    nodeA.forceState('RED', 3);

    // Spawn K xe ở Ngã tư A (thông qua Canvas Ref)
    if (simRef.current) {
      simRef.current.spawnTestPlatoon(K);
    }

    // Chờ A chuyển Xanh (tự động sau 3s) và kích hoạt Làn Sóng Xanh
    setTimeout(() => {
      addLog(`[HỆ THỐNG] Kích hoạt Làn Sóng Xanh, đẩy tín hiệu dự báo tới B.`, 'warning');
      nodeB.applyCoordination(OFFSET, Math.round(K / config.x));
    }, 3200);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
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

        <div className="mb-8">
          <SimulatorCanvas 
            ref={simRef}
            lightA={nodeA.light} timerA={nodeA.timer}
            lightB={nodeB.light} timerB={nodeB.timer}
          />
        </div>

        <Dashboard logs={logs} onTestCase={handleTestCase} />
      </div>
    </div>
  );
}