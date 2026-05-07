import { useState, useRef, useCallback, useEffect } from 'react';
import { Zap, RotateCcw } from 'lucide-react';
import { useTrafficLogic } from './hooks/useTrafficLogic';
import { SimulatorCanvas, type SimulatorRef } from './components/SimulatorCanvas';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CoreTech } from './components/CoreTech';
import { Features } from './components/Features';
import { VideoDemo } from './components/VideoDemo';
import { Footer } from './components/Footer';
import { Modals } from './components/Modals';
import type { LogEntry, LogType, SystemConfig } from './types';

const OFFSET = 25;

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [config, setConfig] = useState<SystemConfig>({ x: 1, distance: 500, speed: 50 });
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const simRef = useRef<SimulatorRef>(null);
  const pendingCoordRef = useRef<number | null>(null);

  const addLog = useCallback((msg: string, type: LogType = 'info') => {
    setLogs(prev => [{ id: Date.now() + Math.random(), time: new Date().toLocaleTimeString('vi-VN', { hour12: false }), msg, type }, ...prev].slice(0, 100));
  }, []);

  const getWaitingCarsA = useCallback(() => {
    return simRef.current?.getWaitingCarsA() || 0;
  }, []);

  const getWaitingCarsB = useCallback(() => {
    return simRef.current?.getWaitingCarsB() || 0;
  }, []);

  const nodeA = useTrafficLogic('GREEN', 22, 'NODE A', addLog, getWaitingCarsA, isPaused);
  const nodeB = useTrafficLogic('RED', 50, 'NODE B', addLog, getWaitingCarsB, isPaused);

  const handleTestCase = (testCase: number, K: number) => {
    if (simRef.current) simRef.current.reset();
    
    addLog(`--- BẮT ĐẦU TEST KỊCH BẢN ${testCase} ---`, 'info');
    
    // Gán kịch bản cho B
    if (testCase === 1) nodeB.forceState('RED', 60); 
    else if (testCase === 2) nodeB.forceState('RED', 15); 

    // Đưa A về Đỏ 3s để gom K xe lại
    nodeA.forceState('RED', 3);

    // Lưu lại K để đợi A chuyển xanh mới kích hoạt coordination
    pendingCoordRef.current = K;

    // Spawn K xe ở Ngã tư A (thông qua Canvas Ref)
    if (simRef.current) {
      simRef.current.spawnTestPlatoon(K);
    }
  };

  // Logic kích hoạt Làn Sóng Xanh khi A chuyển sang Xanh
  useEffect(() => {
    if (nodeA.light === 'GREEN' && pendingCoordRef.current !== null) {
      const K = pendingCoordRef.current;
      pendingCoordRef.current = null;
      addLog(`[HỆ THỐNG] Nút A chuyển XANH! Kích hoạt Làn Sóng Xanh tới B.`, 'warning');
      nodeB.applyCoordination(OFFSET, Math.round(K / config.x));
    }
  }, [nodeA.light, nodeB, OFFSET, config.x, addLog]);

  const handleReset = () => {
    setIsPaused(false);
    pendingCoordRef.current = null;
    addLog(`--- HỆ THỐNG ĐÃ ĐƯỢC RESET ---`, 'success');
    if (simRef.current) {
      simRef.current.reset();
    }
    nodeA.forceState('GREEN', 22);
    nodeB.forceState('RED', 50);
  };

  const openModal = (id: string) => {
    setActiveModal(id);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="bg-[#030508] text-white font-sans overflow-x-hidden selection:bg-cyan-400/30 selection:text-cyan-400">
      <Header />
      <Hero />
      <CoreTech onOpenModal={openModal} />
      <Features onOpenModal={openModal} />
      <VideoDemo />

      <section id="simulator" className="py-24 border-t border-white/5 relative">
        {/* Background gradient for simulator section */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#132b63_0%,transparent_50%)] opacity-30 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-cyan-400 text-sm tracking-[0.2em] uppercase font-bold">LIVE DEMO</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">Mô Phỏng Giao Lộ Thông Minh</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Phiên bản mô phỏng đa làn tích hợp trực tiếp vào website SmartFlow, giữ nguyên trải nghiệm và phong cách giao diện.</p>
          </div>

          <div className="bg-[#0b101a] p-3 md:p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <header className="flex flex-col md:flex-row justify-between items-center bg-white/5 p-4 md:p-5 rounded-2xl border border-white/10 mb-6 md:mb-8 shadow-lg shadow-black/20 gap-4">
               <h1 className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-2 md:gap-3 text-center">
                 <Zap className="text-cyan-400 shrink-0" size={24} /> SMARTFLOW SIM
               </h1>
               <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 text-xs font-bold uppercase text-slate-400">
                 <div className="flex items-center gap-3 md:flex-col md:items-end">
                    <span>Hệ số giảm trừ: x = {config.x}</span>
                    <input 
                      type="range" min="1" max="4" value={config.x} 
                      onChange={(e) => setConfig({...config, x: Number(e.target.value)})}
                      className="w-24 md:w-32 accent-cyan-500" 
                    />
                 </div>
                 <span className="text-emerald-400 text-sm md:text-base bg-emerald-500/10 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">Offset: {OFFSET}s</span>
               </div>
            </header>

            <div className="mb-6 md:mb-8 bg-black/40 p-1 md:p-6 rounded-2xl border-0 md:border border-white/5 flex items-center justify-center relative overflow-hidden">
              <div className="hidden md:block absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
              
              <div className="w-full max-w-[1000px] relative z-10 mx-auto">
                {/* Nút STOP lớn và rực rỡ hơn */}
                <button 
                  onClick={() => setIsPaused(!isPaused)} 
                  className={`absolute top-6 left-6 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl border-2 text-sm font-black uppercase tracking-[0.15em] transition-all active:scale-90 shadow-[0_0_30px_rgba(244,63,94,0.3)] hover:shadow-[0_0_50px_rgba(244,63,94,0.5)] ${isPaused ? 'bg-rose-600 text-white border-white animate-pulse shadow-[0_0_40px_rgba(225,29,72,0.8)]' : 'bg-rose-500/20 text-rose-500 border-rose-500/50 hover:bg-rose-500/30'}`}
                >
                  {isPaused ? (
                    <><RotateCcw size={20} className="animate-spin-slow" /> TIẾP TỤC (RESUME)</>
                  ) : (
                    <><div className="w-3 h-3 rounded-sm bg-rose-500 shadow-[0_0_10px_#f43f5e]" /> DỪNG (STOP)</>
                  )}
                </button>

                <SimulatorCanvas 
                  ref={simRef}
                  lightA={nodeA.light} timerA={nodeA.timer}
                  lightB={nodeB.light} timerB={nodeB.timer}
                  isPaused={isPaused}
                />
              </div>
            </div>

            <Dashboard 
              logs={logs} 
              onTestCase={handleTestCase} 
              onReset={handleReset} 
            />
          </div>
        </div>
      </section>

      <Footer />
      <Modals activeModal={activeModal} onClose={closeModal} />
    </div>
  );
}