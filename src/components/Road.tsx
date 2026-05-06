import React from 'react';
import { CarFront, MoveRight } from 'lucide-react';
import type { Platoon } from '../types';

interface Props {
  platoons: Platoon[];
  offset: number;
}

export const Road: React.FC<Props> = ({ platoons, offset }) => {
  return (
    <div className="flex-1 h-48 bg-slate-800 mx-[-30px] relative flex flex-col justify-center border-y-4 border-slate-600 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] overflow-hidden z-10">
      {/* Vạch kẻ đường */}
      <div className="w-full border-t-4 border-dashed border-slate-500/50 absolute top-1/2 -translate-y-1/2" />
      
      {platoons.map((p) => (
        <div 
          key={p.id}
          className="absolute car-transition flex flex-col items-center z-30"
          style={{ left: `${((offset - p.remaining) / offset) * 88 + 6}%` }}
        >
          {/* Nhãn số xe */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg mb-2 shadow-lg shadow-cyan-500/50 flex items-center gap-1">
            {p.count} xe <MoveRight size={10} />
          </div>
          {/* Icon xe */}
          <div className="bg-white p-2 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.4)] relative">
             <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex gap-1 opacity-50">
                <div className="w-2 h-1 bg-white rounded-full animate-pulse" />
                <div className="w-3 h-1 bg-white rounded-full animate-pulse delay-75" />
             </div>
             <CarFront className="text-slate-800 relative z-10" size={24} />
          </div>
        </div>
      ))}
    </div>
  );
};