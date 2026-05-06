import { useState, useEffect, useRef, useCallback } from 'react';
import { Zap } from 'lucide-react';
import { useTrafficLogic } from './hooks/useTrafficLogic';
import { Intersection } from './components/Intersection';
import { Road } from './components/Road';
import { Dashboard } from './components/Dashboard';
import type { LogEntry, LogType, SystemConfig, CarData } from './types';

const OFFSET = 36;
const STOP_A = 22; // Vị trí ngã tư A (22% đường)
const STOP_B = 78; // Vị trí ngã tư B (78% đường)
const CAR_SAFE_DIST = 2; // Khoảng cách an toàn giữa 2 xe (%)
const PHYSICS_FPS = 20;

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [config, setConfig] = useState<SystemConfig>({ x: 2, distance: 500, speed: 50 });
  const [cars, setCars] = useState<CarData[]>([]);
  const carsRef = useRef<CarData[]>([]);

  // Tốc độ: Đi từ A đến B (56%) mất OFFSET giây.
  const CAR_SPEED_PER_FRAME = (STOP_B - STOP_A) / OFFSET / PHYSICS_FPS;

  const addLog = useCallback((msg: string, type: LogType = 'info') => {
    setLogs(prev => [{ id: Date.now() + Math.random(), time: new Date().toLocaleTimeString('vi-VN', { hour12: false }), msg, type }, ...prev].slice(0, 100));
  }, []);

  const getWaitingCarsA = useCallback(() => {
    return carsRef.current.filter(c => c.x > STOP_A - 30 && c.x <= STOP_A).length;
  }, []);

  const getWaitingCarsB = useCallback(() => {
    return carsRef.current.filter(c => c.x > STOP_B - 30 && c.x <= STOP_B).length;
  }, []);

  const nodeA = useTrafficLogic('GREEN', 22, 'NODE A', addLog, getWaitingCarsA);
  const nodeB = useTrafficLogic('RED', 50, 'NODE B', addLog, getWaitingCarsB);

  // Dùng refs cho vòng lặp vật lý
  const lightARef = useRef(nodeA.light);
  const lightBRef = useRef(nodeB.light);
  useEffect(() => { lightARef.current = nodeA.light; }, [nodeA.light]);
  useEffect(() => { lightBRef.current = nodeB.light; }, [nodeB.light]);

  // Vòng lặp Vật lý di chuyển từng chiếc xe
  useEffect(() => {
    const loop = setInterval(() => {
      setCars(prev => {
        const sorted = [...prev].sort((a, b) => b.x - a.x); // Ưu tiên xe đi trước
        
        let newCars = sorted.map((car, i) => {
          let speed = CAR_SPEED_PER_FRAME;

          // Check va chạm với xe phía trước
          if (i > 0) {
            const ahead = sorted[i - 1];
            if (ahead.x - car.x < CAR_SAFE_DIST) {
              speed = 0; // Thắng gấp nếu quá sát
            }
          }

          // Check đèn giao thông A
          if (car.x <= STOP_A && STOP_A - car.x < CAR_SAFE_DIST && lightARef.current !== 'GREEN') {
             speed = 0;
          }
          // Check đèn giao thông B
          if (car.x > STOP_A && car.x <= STOP_B && STOP_B - car.x < CAR_SAFE_DIST && lightBRef.current !== 'GREEN') {
             speed = 0;
          }

          return { ...car, x: car.x + speed };
        });

        // Hủy xe đã ra khỏi màn hình
        newCars = newCars.filter(c => c.x < 105);
        carsRef.current = newCars;
        return newCars;
      });
    }, 1000 / PHYSICS_FPS);
    return () => clearInterval(loop);
  }, []);

  const handleTestCase = (testCase: number, K: number) => {
    addLog(`--- BẮT ĐẦU TEST KỊCH BẢN ${testCase} ---`, 'info');
    
    // Gán kịch bản cho B
    if (testCase === 1) nodeB.forceState('RED', 60); 
    else if (testCase === 2) nodeB.forceState('RED', 15); 
    else if (testCase === 3) nodeB.forceState('GREEN', 30); 

    // Đưa A về Đỏ 3s để gom K xe lại
    nodeA.forceState('RED', 3);

    // Spawn K xe xếp hàng sau vạch ngã tư A
    const newSpawn: CarData[] = [];
    for (let i = 0; i < K; i++) {
      newSpawn.push({
        id: Date.now() + i,
        x: STOP_A - (i * CAR_SAFE_DIST) - 1
      });
    }
    setCars(newSpawn);
    carsRef.current = newSpawn;

    // Chờ A chuyển Xanh (tự động sau 3s) và kích hoạt Làn Sóng Xanh
    setTimeout(() => {
      addLog(`[HỆ THỐNG] Kích hoạt Làn Sóng Xanh, đẩy tín hiệu dự báo tới B.`, 'warning');
      nodeB.applyCoordination(OFFSET, Math.round(K / config.x));
    }, 3200);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
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

        <div className="bg-slate-800/50 rounded-3xl p-12 mb-8 border border-white/5 relative shadow-inner overflow-hidden">
          <div className="flex justify-between items-center relative">
            <Intersection name="NGÃ TƯ A" light={nodeA.light} timer={nodeA.timer} />
            <Road cars={cars} />
            <Intersection name="NGÃ TƯ B" light={nodeB.light} timer={nodeB.timer} isAI />
          </div>
        </div>

        <Dashboard logs={logs} onTestCase={handleTestCase} />
      </div>
    </div>
  );
}