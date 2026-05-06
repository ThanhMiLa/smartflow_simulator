import React from 'react';
import { CarFront } from 'lucide-react';
import type { CarData } from '../types';

interface Props {
  cars: CarData[];
}

export const Road: React.FC<Props> = ({ cars }) => {
  return (
    <div className="flex-1 h-48 bg-slate-800 mx-[-30px] relative flex flex-col justify-center border-y-4 border-slate-600 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] overflow-hidden z-10">
      {/* Vạch kẻ đường */}
      <div className="w-full border-t-4 border-dashed border-slate-500/50 absolute top-1/2 -translate-y-1/2" />
      
      {cars.map((car) => (
        <div 
          key={car.id}
          className="absolute flex flex-col items-center z-30"
          style={{ left: `${car.x}%`, transform: 'translateX(-50%)', transition: 'left 0.05s linear' }}
        >
          {/* Icon xe nhỏ */}
          <div className="bg-white p-1.5 rounded-md shadow-[0_0_15px_rgba(255,255,255,0.4)]">
             <CarFront className="text-slate-800" size={16} />
          </div>
        </div>
      ))}
    </div>
  );
};