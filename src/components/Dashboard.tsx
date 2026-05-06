import React from 'react';
import { Terminal as TerminalIcon, Settings, Truck, AlertTriangle } from 'lucide-react';
import type { LogEntry, LogType } from '../types';

interface Props {
  logs: LogEntry[];
  onTrigger: (k: number) => void;
}

export const Dashboard: React.FC<Props> = ({ logs, onTrigger }) => {
  const getLogColor = (type: LogType) => {
    switch (type) {
      case 'error': return 'text-rose-400';
      case 'warning': return 'text-amber-400';
      case 'success': return 'text-emerald-400';
      default: return 'text-sky-300';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-72">
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="text-xs font-bold text-slate-300 mb-6 flex items-center gap-2 uppercase tracking-wider">
          <Settings size={16} className="text-cyan-400" /> Giả lập AI Trigger
        </h3>
        <button onClick={() => onTrigger(20)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-3 mb-4 shadow-lg shadow-blue-900/50">
          <Truck size={20} /> GỬI 20 XE TỪ A
        </button>
        <button onClick={() => onTrigger(60)} className="w-full bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold py-3 rounded-xl border border-rose-500/30">
          <AlertTriangle size={18} /> KHẨN CẤP: 60 XE
        </button>
      </div>

      <div className="lg:col-span-2 bg-[#0a0a0a] rounded-2xl p-5 border border-white/10 overflow-y-auto">
        <div className="sticky top-0 bg-[#0a0a0a] pb-2 mb-2 border-b border-white/10 flex items-center gap-2 text-slate-400 text-[10px] font-bold tracking-widest z-10">
          <TerminalIcon size={14} className="text-emerald-400" /> SYSTEM REAL-TIME LOGIC
        </div>
        {logs.map((log) => (
          <div key={log.id} className="flex gap-4 text-xs font-mono mb-1">
            <span className="text-slate-600 shrink-0">[{log.time}]</span>
            <span className={getLogColor(log.type)}>{log.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
};