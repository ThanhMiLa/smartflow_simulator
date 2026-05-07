import { useState, useEffect, useRef } from 'react';
import type { LightState, LogType } from '../types';

export const useTrafficLogic = (
  initialLight: LightState, 
  initialTimer: number, 
  name: string, 
  addLog: (msg: string, type: LogType) => void,
  getWaitingCars: () => number,
  isPaused: boolean
) => {
  const [light, setLight] = useState<LightState>(initialLight);
  const [timer, setTimer] = useState<number>(initialTimer);
  const predictedCarsRef = useRef<number>(0);

  const forceState = (newLight: LightState, newTimer: number) => {
    setLight(newLight);
    setTimer(newTimer);
  };

  // Công thức nội suy tuyến tính GTnext
  const calculateGT = (N: number) => {
    if (N <= 5) return 15;
    if (N >= 50) return 50;
    return Math.round(15 + ((N - 5) / 45) * 35);
  };

  // Vòng lặp đếm ngược cơ bản
  useEffect(() => {
    if (isPaused) return;

    const ticker = setTimeout(() => {
      if (timer <= 1) {
        if (light === 'GREEN') {
          setLight('YELLOW');
          setTimer(3);
        } else if (light === 'YELLOW') {
          setLight('RED');
          setTimer(25);
        } else {
          // Chuyển sang XANH: Áp dụng công thức GTnext
          const nWait = getWaitingCars();
          const nPred = predictedCarsRef.current;
          predictedCarsRef.current = 0; // Reset
          const nTotal = nWait + nPred;
          
          const gtNext = calculateGT(nTotal);
          
          addLog(`[${name}] Đèn XANH. Thực tế: ${nWait} xe chờ, Dự báo: ${nPred} xe. Áp dụng công thức GTnext = ${gtNext}s`, 'success');
          
          setLight('GREEN');
          setTimer(gtNext);
        }
      } else {
        setTimer(t => t - 1);
      }
    }, 1000);
    return () => clearTimeout(ticker);
  }, [light, timer, getWaitingCars, name, addLog, isPaused]);

  // Hàm xử lý Request Làn Sóng Xanh từ nút trước
  const applyCoordination = (offset: number, predictedCars: number) => {
    predictedCarsRef.current = predictedCars; // Cộng gộp vào chu kỳ xanh tiếp theo
    
    if (light === 'RED') {
      if (timer > offset) {
        addLog(`[${name}] KB 1: Ép pha đỏ từ ${timer}s -> ${offset}s để đón ${predictedCars} xe.`, 'warning');
      } else {
        addLog(`[${name}] KB 2: Neo pha đỏ lên ${offset}s chờ đoàn xe.`, 'warning');
      }
      setTimer(offset);
    } else if (light === 'GREEN') {
      addLog(`[${name}] KB 3: Lệch nhịp (đang XANH)! Chèn pha Đỏ ${offset}s ngay.`, 'error');
      setLight('RED');
      setTimer(offset);
    } else {
      setLight('RED');
      setTimer(offset);
    }
  };

  return { light, timer, setLight, setTimer, forceState, applyCoordination };
};