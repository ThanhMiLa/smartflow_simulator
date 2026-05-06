import React, { useState } from 'react';
import { Terminal as TerminalIcon, Settings, Play, RotateCcw } from 'lucide-react';
import type { LogEntry, LogType } from '../types';

interface Props {
  logs: LogEntry[];
  onTestCase: (testCase: number, cars: number) => void;
  onReset: () => void;
}

export const Dashboard: React.FC<Props> = ({ logs, onTestCase, onReset }) => {
  const [cars, setCars] = useState<number>(30);

  const getLogColor = (type: LogType) => {
    switch (type) {
      case 'error': return 'text-rose-400';
      case 'warning': return 'text-amber-400';
      case 'success': return 'text-emerald-400';
      default: return 'text-sky-300';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[400px]">
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col shadow-lg shadow-black/20 overflow-hidden lg:h-full">
        <h3 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2 uppercase tracking-wider shrink-0">
          <Settings size={16} className="text-cyan-400" /> Cài đặt Kịch bản Test
        </h3>
        
        <div className="mb-4 shrink-0">
          <label className="text-xs text-slate-400 mb-2 block uppercase font-bold">Số lượng xe dự kiến (K)</label>
          <input 
            type="number" 
            value={cars}
            onChange={(e) => setCars(Number(e.target.value) || 0)}
            className="w-full bg-slate-800/80 border border-slate-600 rounded-lg p-2.5 text-white font-mono text-lg text-center outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
          />
        </div>

        <div className="flex-1 flex flex-col gap-2.5">
          <button onClick={() => onTestCase(1, cars)} className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold py-3 rounded-xl border border-emerald-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-900/20">
            <Play size={18} /> KỊCH BẢN 1 (ĐỎ &gt; 36s)
          </button>
          <button onClick={() => onTestCase(2, cars)} className="w-full bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold py-3 rounded-xl border border-amber-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-900/20">
            <Play size={18} /> KỊCH BẢN 2 (ĐỎ &lt; 36s)
          </button>
          <button onClick={() => onTestCase(3, cars)} className="w-full bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold py-3 rounded-xl border border-rose-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-rose-900/20">
            <Play size={18} /> KỊCH BẢN 3 (ĐANG XANH)
          </button>
          <button onClick={onReset} className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold py-3 rounded-xl border border-cyan-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-cyan-900/20 mt-2 lg:mt-auto">
            <RotateCcw size={18} /> LÀM MỚI (RESET)
          </button>
        </div>
      </div>

      <div className="lg:col-span-2 bg-[#0a0a0a] rounded-2xl p-5 border border-white/10 flex flex-col relative overflow-hidden h-[300px] lg:h-full">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" />
        <div className="sticky top-0 bg-[#0a0a0a] pb-3 mb-2 border-b border-white/10 flex items-center gap-2 text-slate-400 text-[10px] font-bold tracking-widest z-10 shrink-0">
          <TerminalIcon size={14} className="text-cyan-400" /> SYSTEM REAL-TIME LOGIC (TERMINAL)
        </div>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-4 text-xs font-mono mb-2 leading-relaxed">
              <span className="text-slate-600 shrink-0">[{log.time}]</span>
              <span className={getLogColor(log.type)}>{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};