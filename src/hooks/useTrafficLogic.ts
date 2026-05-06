import { useState, useEffect } from 'react';
import type { LightState, LogType } from '../types';

export const useTrafficLogic = (
  initialLight: LightState, 
  initialTimer: number, 
  name: string, 
  addLog: (msg: string, type: LogType) => void
) => {
  const [light, setLight] = useState<LightState>(initialLight);
  const [timer, setTimer] = useState<number>(initialTimer);

  const forceState = (newLight: LightState, newTimer: number) => {
    setLight(newLight);
    setTimer(newTimer);
  };

  // Vòng lặp đếm ngược cơ bản
  useEffect(() => {
    const ticker = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          if (light === 'GREEN') {
            setLight('YELLOW');
            return 3;
          } else if (light === 'YELLOW') {
            setLight('RED');
            return 36;
          } else {
            setLight('GREEN');
            return 22;
          }
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(ticker);
  }, [light]);

  // Hàm xử lý Request từ nút trước (A -> B)
  const applyCoordination = (offset: number, predictedCars: number) => {
    if (light === 'RED') {
      if (timer > offset) {
        addLog(`[${name}] KB 1: Ép pha đỏ từ ${timer}s -> ${offset}s để đón ${predictedCars} xe.`, 'warning');
      } else {
        addLog(`[${name}] KB 2: Neo pha đỏ lên ${offset}s chờ đoàn xe.`, 'warning');
      }
      setTimer(offset);
    } else {
      addLog(`[${name}] KB 3: Lệch nhịp (đang ${light})! Cắt pha hiện tại, chèn pha Đỏ ${offset}s ngay.`, 'error');
      setLight('RED');
      setTimer(offset);
    }
  };

  return { light, timer, setLight, setTimer, forceState, applyCoordination };
};