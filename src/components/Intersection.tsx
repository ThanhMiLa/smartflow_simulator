import React from 'react';
import type { LightState } from '../types';

interface Props {
  name: string;
  light: LightState;
  timer: number;
  isAI?: boolean;
}

export const Intersection: React.FC<Props> = ({ name, light, timer, isAI }) => {
  return (
    <div className="flex flex-col items-center z-20">
      <div className="bg-slate-800 p-3 rounded-3xl border-4 border-slate-700 shadow-2xl flex flex-col gap-2 relative">
        {/* Glow effect box */}
        <div className={`absolute inset-0 rounded-2xl opacity-20 blur-xl transition-all duration-500 ${light === 'RED' ? 'bg-red-500' : light === 'YELLOW' ? 'bg-yellow-400' : 'bg-green-500'}`} />
        
        <div className={`w-12 h-12 rounded-full transition-all duration-300 relative z-10 ${light === 'RED' ? 'bg-red-500 shadow-[0_0_20px_#ef4444]' : 'bg-red-950 opacity-40'}`} />
        <div className={`w-12 h-12 rounded-full transition-all duration-300 relative z-10 ${light === 'YELLOW' ? 'bg-yellow-400 shadow-[0_0_20px_#facc15]' : 'bg-yellow-950 opacity-40'}`} />
        <div className={`w-12 h-12 rounded-full transition-all duration-300 relative z-10 ${light === 'GREEN' ? 'bg-green-500 shadow-[0_0_20px_#22c55e]' : 'bg-green-950 opacity-40'}`} />
      </div>
      <div className={`mt-5 text-center px-6 py-3 rounded-xl border backdrop-blur transition-colors duration-300 ${isAI ? 'bg-blue-900/40 border-blue-500/50' : 'bg-black/60 border-white/20'}`}>
        <p className={`text-[10px] font-bold tracking-widest ${isAI ? 'text-blue-300' : 'text-slate-400'}`}>{name}</p>
        <p className={`text-4xl font-black font-mono mt-1 ${light === 'RED' ? 'text-red-400' : light === 'YELLOW' ? 'text-yellow-400' : 'text-green-400'}`}>{timer}</p>
      </div>
    </div>
  );
};