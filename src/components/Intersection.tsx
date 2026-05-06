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
      <div className="bg-slate-800 p-4 rounded-3xl border-4 border-slate-700 shadow-2xl">
        <div className={`w-14 h-14 rounded-full mb-4 transition-all duration-300 ${light === 'RED' ? 'bg-red-500 shadow-[0_0_25px_#ef4444]' : 'bg-red-950 opacity-30'}`} />
        <div className={`w-14 h-14 rounded-full transition-all duration-300 ${light === 'GREEN' ? 'bg-green-500 shadow-[0_0_25px_#22c55e]' : 'bg-green-950 opacity-30'}`} />
      </div>
      <div className={`mt-6 text-center px-6 py-2 rounded-xl border backdrop-blur ${isAI ? 'bg-blue-900/30 border-blue-500/30' : 'bg-black/50 border-white/10'}`}>
        <p className={`text-[10px] font-bold tracking-widest ${isAI ? 'text-blue-300' : 'text-slate-400'}`}>{name}</p>
        <p className="text-4xl font-black font-mono text-white mt-1">{timer}</p>
      </div>
    </div>
  );
};