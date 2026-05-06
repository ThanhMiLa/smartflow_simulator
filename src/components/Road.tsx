import React from 'react';
import { CarFront } from 'lucide-react';
import type { Platoon } from '../types';

interface Props {
  platoons: Platoon[];
  offset: number;
}

export const Road: React.FC<Props> = ({ platoons, offset }) => {
  return (
    <div className="flex-1 h-40 bg-slate-800 mx-[-20px] relative flex flex-col justify-center border-y-4 border-slate-600 shadow-inner overflow-hidden">
      <div className="w-full border-t-4 border-dashed border-slate-500/50 absolute top-1/2 -translate-y-1/2" />
      {platoons.map((p) => (
        <div 
          key={p.id}
          className="absolute car-transition flex flex-col items-center z-30"
          style={{ left: `${((offset - p.remaining) / offset) * 85}%` }}
        >
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg mb-1 shadow-lg shadow-cyan-500/50">
            {p.count} xe
          </div>
          <div className="bg-white p-1.5 rounded-lg shadow-white/20 shadow-lg">
             <CarFront className="text-slate-800" size={20} />
          </div>
        </div>
      ))}
    </div>
  );
};