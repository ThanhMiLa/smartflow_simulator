import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import type { LightState } from '../types';

export interface SimulatorRef {
  spawnTestPlatoon: (K: number) => void;
  getWaitingCarsA: () => number;
  getWaitingCarsB: () => number;
  reset: () => void;
}

interface Props {
  lightA: LightState;
  timerA: number;
  lightB: LightState;
  timerB: number;
  isPaused: boolean;
}

interface Car {
  id: number;
  axis: 'EW' | 'NS_A' | 'NS_B';
  dir: 'right' | 'left' | 'down' | 'up';
  laneKey: string;
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  vel: number;
  maxAccel: number;
  color: string;
  passedA?: boolean;
  passedB?: boolean;
  _dead: boolean;
  turnDecision?: 'straight' | 'right';
  turnTarget?: 'A' | 'B';
  isPlatoon?: boolean;
  platoonSize?: number;
}

const W = 1200;
const H = 540;
const cxA = 300;
const cxB = 900;
const cy = 270;
const OFFSET = 36; // seconds
const DISTANCE = cxB - cxA;
const BASE_SPEED = DISTANCE / OFFSET; // px/s (~16.6)

const lanesPerDirEW = 2;
const lanesPerDirNS = 1;
const laneW = 20;
const laneGap = 4;
const roadMargin = 12;

const roadW_EW = roadMargin * 2 + lanesPerDirEW * laneW * 2 + laneGap * (lanesPerDirEW * 2 - 1);
const roadW_NS = roadMargin * 2 + lanesPerDirNS * laneW * 2 + laneGap * (lanesPerDirNS * 2 - 1);

const crossHalfEW = roadW_EW / 2;
const crossHalfNS = roadW_NS / 2;

const stopLineOffsetEW = crossHalfNS + 10;
const stopLineOffsetNS = crossHalfEW + 10;
const stopPad = 5;


export const SimulatorCanvas = forwardRef<SimulatorRef, Props>(({ lightA, timerA, lightB, timerB, isPaused }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRefMobile = useRef<HTMLCanvasElement>(null);
  const carsRef = useRef<Car[]>([]);
  const idGenRef = useRef(0);
  const spawnAccRef = useRef(0);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);
  
  // Refs for current lights to use in animation frame
  const stateA = useRef({ light: lightA, timer: timerA });
  const stateB = useRef({ light: lightB, timer: timerB });
  useEffect(() => { stateA.current = { light: lightA, timer: timerA }; }, [lightA, timerA]);
  useEffect(() => { stateB.current = { light: lightB, timer: timerB }; }, [lightB, timerB]);

  const getStateA = (axis: 'EW' | 'NS') => {
    if (axis === 'EW') return stateA.current.light;
    if (stateA.current.light === 'GREEN' || stateA.current.light === 'YELLOW') return 'RED';
    return stateA.current.timer > 3 ? 'GREEN' : 'YELLOW';
  };

  const getStateB = (axis: 'EW' | 'NS') => {
    if (axis === 'EW') return stateB.current.light;
    if (stateB.current.light === 'GREEN' || stateB.current.light === 'YELLOW') return 'RED';
    return stateB.current.timer > 3 ? 'GREEN' : 'YELLOW';
  };

  const getLaneOffset = (i: number, lanesPerDir: number) => {
    const step = laneW + laneGap;
    const mid = (lanesPerDir - 1) / 2;
    return (i - mid) * step;
  };

  useImperativeHandle(ref, () => ({
    spawnTestPlatoon: (K: number) => {
      const laneIndex = 0; // Use a fixed lane for platoon
      const offset = getLaneOffset(laneIndex, lanesPerDirEW);
      const yW2E = cy + (laneW / 2 + laneGap / 2) + (laneW + laneGap) * (lanesPerDirEW - 1) / 2 + offset;
      
      const newCar: Car = {
        id: idGenRef.current++,
        axis: 'EW', dir: 'right', laneKey: `EW_right_${laneIndex}`,
        x: cxA - stopLineOffsetEW - 80,
        y: yW2E, 
        w: 96, h: 24, // Double the previous size
        speed: BASE_SPEED * (0.9 + Math.random() * 0.2),
        vel: BASE_SPEED, maxAccel: 50,
        color: '#ff3366', // Red color for platoon
        passedA: false, passedB: false, _dead: false,
        isPlatoon: true, platoonSize: K
      };
      carsRef.current.push(newCar);

      // --- Sinh 10 xe nhỏ màu đỏ đứng đợi sẵn ở ngã tư B ---
      for (let i = 0; i < 10; i++) {
        const waitLaneIndex = i % lanesPerDirEW; // Rải đều ra các làn EW
        const waitOffset = getLaneOffset(waitLaneIndex, lanesPerDirEW);
        const waitY = cy + (laneW / 2 + laneGap / 2) + (laneW + laneGap) * (lanesPerDirEW - 1) / 2 + waitOffset;
        
        // Xếp hàng ngay sau vạch dừng của B
        const row = Math.floor(i / lanesPerDirEW);
        const waitX = cxB - stopLineOffsetEW - 15 - (row * 40); // Shorter cars, tighter spacing

        const waitCar: Car = {
          id: idGenRef.current++,
          axis: 'EW', dir: 'right', laneKey: `EW_right_${waitLaneIndex}`,
          x: waitX,
          y: waitY,
          w: 29, h: 7, // Kích thước xe nhỏ giảm 40% (48*0.6, 12*0.6)
          speed: BASE_SPEED * (0.8 + Math.random() * 0.4),
          vel: 0, // Đang dừng chờ
          maxAccel: 50,
          color: '#ff3366', // Màu đỏ
          passedA: true, // Đã đi qua A rồi
          passedB: false, _dead: false,
          isPlatoon: false
        };
        carsRef.current.push(waitCar);
      }
    },
    getWaitingCarsA: () => {
      let count = 0;
      for (const c of carsRef.current) {
         if (c.axis === 'EW' && c.dir === 'right' && c.vel < 5 && c.x > cxA - stopLineOffsetEW - 800 && c.x <= cxA - stopLineOffsetEW) {
            count += c.isPlatoon ? (c.platoonSize || 1) : 1;
         }
      }
      return count;
    },
    getWaitingCarsB: () => {
      let count = 0;
      for (const c of carsRef.current) {
         if (c.axis === 'EW' && c.dir === 'right' && c.vel < 5 && c.x > cxB - stopLineOffsetEW - 800 && c.x <= cxB - stopLineOffsetEW) {
            count += c.isPlatoon ? (c.platoonSize || 1) : 1;
         }
      }
      return count;
    },
    reset: () => {
      carsRef.current = [];
      spawnAccRef.current = 0;
      idGenRef.current = 0;
    }
  }));

  useEffect(() => {
    let lastT = performance.now();
    let animFrameId: number;

    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - lastT) / 1000);
      lastT = t;

      updatePhysics(dt);

      const ctx1 = canvasRef.current?.getContext('2d');
      if (ctx1) draw(ctx1);

      const ctx2 = canvasRefMobile.current?.getContext('2d');
      if (ctx2) draw(ctx2);

      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameId);
  }, []);

  // --- Sinh xe tự động xen kẽ ---
  const spawnRandom = (dt: number) => {
    const rate = 0.2; // Further reduced rate to lower small cars on main axis
    spawnAccRef.current += dt * rate;
    while (spawnAccRef.current >= 1) {
      spawnAccRef.current -= 1;
      const r = Math.random();
      
      let axis: 'EW' | 'NS_A' | 'NS_B' = 'EW';
      let dir: 'left' | 'right' | 'up' | 'down' = 'right';
      let lanesPD = lanesPerDirEW;
      
      if (r < 0.08) { axis = 'NS_A'; dir = 'down'; lanesPD = lanesPerDirNS; }
      else if (r < 0.16) { axis = 'NS_A'; dir = 'up'; lanesPD = lanesPerDirNS; }
      else if (r < 0.24) { axis = 'NS_B'; dir = 'down'; lanesPD = lanesPerDirNS; }
      else if (r < 0.32) { axis = 'NS_B'; dir = 'up'; lanesPD = lanesPerDirNS; }
      else if (r < 0.66) { axis = 'EW'; dir = 'left'; lanesPD = lanesPerDirEW; }
      else { axis = 'EW'; dir = 'right'; lanesPD = lanesPerDirEW; }

      const laneIndex = Math.floor(Math.random() * lanesPD);
      const offset = getLaneOffset(laneIndex, lanesPD);
      
      const speed = BASE_SPEED * (0.8 + Math.random() * 0.4);
      const color = '#38bdf8'; // All normal cars are blue

      let turnDecision: 'straight' | 'right' = 'straight';
      if (laneIndex === lanesPD - 1 && Math.random() < 0.5) { // 50% turn right for small blue cars
         turnDecision = 'right';
      }

      let car: Partial<Car> = { id: idGenRef.current, axis, dir, speed, vel: speed, maxAccel: 60, color, _dead: false, passedA: false, passedB: false, turnDecision };
      
      if (axis === 'NS_A' && dir === 'down') {
        car.laneKey = `NSA_down_${laneIndex}`; car.w = 12; car.h = 24; car.x = cxA - (laneW / 2 + laneGap / 2) - (laneW + laneGap) * (lanesPD - 1) / 2 + offset; car.y = -50; car.turnTarget = 'A';
      } else if (axis === 'NS_A' && dir === 'up') {
        car.laneKey = `NSA_up_${laneIndex}`; car.w = 12; car.h = 24; car.x = cxA + (laneW / 2 + laneGap / 2) + (laneW + laneGap) * (lanesPD - 1) / 2 + offset; car.y = H + 50; car.turnTarget = 'A';
      } else if (axis === 'NS_B' && dir === 'down') {
        car.laneKey = `NSB_down_${laneIndex}`; car.w = 12; car.h = 24; car.x = cxB - (laneW / 2 + laneGap / 2) - (laneW + laneGap) * (lanesPD - 1) / 2 + offset; car.y = -50; car.turnTarget = 'B';
      } else if (axis === 'NS_B' && dir === 'up') {
        car.laneKey = `NSB_up_${laneIndex}`; car.w = 12; car.h = 24; car.x = cxB + (laneW / 2 + laneGap / 2) + (laneW + laneGap) * (lanesPD - 1) / 2 + offset; car.y = H + 50; car.turnTarget = 'B';
      } else if (axis === 'EW' && dir === 'left') {
        car.laneKey = `EW_left_${laneIndex}`; car.w = 24; car.h = 12; car.x = W + 50; car.y = cy - (laneW / 2 + laneGap / 2) - (laneW + laneGap) * (lanesPD - 1) / 2 + offset; car.turnTarget = Math.random() < 0.5 ? 'A' : 'B';
      } else { // EW right
        car.laneKey = `EW_right_${laneIndex}`; car.w = 24; car.h = 12; car.x = -50; car.y = cy + (laneW / 2 + laneGap / 2) + (laneW + laneGap) * (lanesPD - 1) / 2 + offset; car.turnTarget = Math.random() < 0.5 ? 'A' : 'B';
      }
      
      carsRef.current.push(car as Car);
    }
  };

  const updatePhysics = (dt: number) => {
    if (isPausedRef.current) return;
    
    spawnRandom(dt);

    const cars = carsRef.current;
    for (const c of cars) {
      if (c._dead) continue;

      // Xóa xe khi đi khỏi màn hình
      if (c.x < -100 || c.x > W + 100 || c.y < -100 || c.y > H + 100) {
        c._dead = true;
        continue;
      }

      let needStop = false;
      let targetStop = 0;

      // Logic ngã tư
      if (c.axis === 'EW') {
        if (c.dir === 'right') {
          if (!c.passedA) {
            targetStop = cxA - stopLineOffsetEW;
            if (getStateA('EW') !== 'GREEN' && c.x + c.w/2 >= targetStop - stopPad && c.x + c.w/2 <= targetStop) needStop = true;
            if (c.x > cxA + 10) c.passedA = true;
          } else if (!c.passedB) {
            targetStop = cxB - stopLineOffsetEW;
            if (getStateB('EW') !== 'GREEN' && c.x + c.w/2 >= targetStop - stopPad && c.x + c.w/2 <= targetStop) needStop = true;
            if (c.x > cxB + 10) c.passedB = true;
          }
        } else { // left
          if (!c.passedB) {
            targetStop = cxB + stopLineOffsetEW;
            if (getStateB('EW') !== 'GREEN' && c.x - c.w/2 <= targetStop + stopPad && c.x - c.w/2 >= targetStop) needStop = true;
            if (c.x < cxB - 10) c.passedB = true;
          } else if (!c.passedA) {
            targetStop = cxA + stopLineOffsetEW;
            if (getStateA('EW') !== 'GREEN' && c.x - c.w/2 <= targetStop + stopPad && c.x - c.w/2 >= targetStop) needStop = true;
            if (c.x < cxA - 10) c.passedA = true;
          }
        }
      } else if (c.axis === 'NS_A') {
        const state = getStateA('NS');
        if (c.dir === 'down') {
          targetStop = cy - stopLineOffsetNS;
          if (state !== 'GREEN' && c.y + c.h/2 >= targetStop - stopPad && c.y + c.h/2 <= targetStop && !c.passedA) needStop = true;
          if (c.y > cy + 10) c.passedA = true;
        } else {
          targetStop = cy + stopLineOffsetNS;
          if (state !== 'GREEN' && c.y - c.h/2 <= targetStop + stopPad && c.y - c.h/2 >= targetStop && !c.passedA) needStop = true;
          if (c.y < cy - 10) c.passedA = true;
        }
      } else if (c.axis === 'NS_B') {
        const state = getStateB('NS');
        if (c.dir === 'down') {
          targetStop = cy - stopLineOffsetNS;
          if (state !== 'GREEN' && c.y + c.h/2 >= targetStop - stopPad && c.y + c.h/2 <= targetStop && !c.passedB) needStop = true;
          if (c.y > cy + 10) c.passedB = true;
        } else {
          targetStop = cy + stopLineOffsetNS;
          if (state !== 'GREEN' && c.y - c.h/2 <= targetStop + stopPad && c.y - c.h/2 >= targetStop && !c.passedB) needStop = true;
          if (c.y < cy - 10) c.passedB = true;
        }
      }

      // Vị trí khi cần dừng
      if (needStop) {
        const stopPosX = c.dir === 'right' ? targetStop - stopPad - c.w/2 : targetStop + stopPad + c.w/2;
        const stopPosY = c.dir === 'down' ? targetStop - stopPad - c.h/2 : targetStop + stopPad + c.h/2;
        if (c.dir === 'right') c.x = Math.min(c.x, stopPosX);
        if (c.dir === 'left') c.x = Math.max(c.x, stopPosX);
        if (c.dir === 'down') c.y = Math.min(c.y, stopPosY);
        if (c.dir === 'up') c.y = Math.max(c.y, stopPosY);
      }

      // Check Turn
      if (c.turnDecision === 'right' && c.turnTarget) {
         const cxTarget = c.turnTarget === 'B' ? cxB : cxA;
         if (c.dir === 'right' && c.x >= cxTarget - 24) {
            c.dir = 'down'; c.axis = c.turnTarget === 'B' ? 'NS_B' : 'NS_A'; c.x = cxTarget - 24; 
            const temp = c.w; c.w = c.h; c.h = temp; c.turnDecision = 'straight';
         } else if (c.dir === 'left' && c.x <= cxTarget + 24) {
            c.dir = 'up'; c.axis = c.turnTarget === 'B' ? 'NS_B' : 'NS_A'; c.x = cxTarget + 24; 
            const temp = c.w; c.w = c.h; c.h = temp; c.turnDecision = 'straight';
         } else if (c.dir === 'down' && c.y >= cy - 24) {
            c.dir = 'left'; c.axis = 'EW'; c.y = cy - 24; 
            const temp = c.w; c.w = c.h; c.h = temp; c.turnDecision = 'straight'; c.passedA = (cxTarget === cxA); c.passedB = (cxTarget === cxB);
         } else if (c.dir === 'up' && c.y <= cy + 24) {
            c.dir = 'right'; c.axis = 'EW'; c.y = cy + 24; 
            const temp = c.w; c.w = c.h; c.h = temp; c.turnDecision = 'straight'; c.passedA = (cxTarget === cxA); c.passedB = (cxTarget === cxB);
         }
      }

      // Check xe phía trước
      let spacingStop = false;
      const ahead = findCarAhead(c);
      if (ahead) {
        const minGap = 8;
        if (c.dir === 'right' && (ahead.x - ahead.w/2) - (c.x + c.w/2) < minGap) spacingStop = true;
        if (c.dir === 'left' && (c.x - c.w/2) - (ahead.x + ahead.w/2) < minGap) spacingStop = true;
        if (c.dir === 'down' && (ahead.y - ahead.h/2) - (c.y + c.h/2) < minGap) spacingStop = true;
        if (c.dir === 'up' && (c.y - c.h/2) - (ahead.y + ahead.h/2) < minGap) spacingStop = true;
      }

      const desired = (needStop || spacingStop) ? 0 : c.speed;
      const dv = desired - c.vel;
      c.vel += Math.max(-c.maxAccel * dt, Math.min(c.maxAccel * dt, dv));

      const ds = c.vel * dt;
      if (c.dir === 'right') c.x += ds;
      if (c.dir === 'left') c.x -= ds;
      if (c.dir === 'down') c.y += ds;
      if (c.dir === 'up') c.y -= ds;
    }

    // Cleanup dead
    carsRef.current = cars.filter(c => !c._dead);
  };

  const findCarAhead = (c: Car) => {
    let best = null;
    let bestDist = Infinity;
    for (const o of carsRef.current) {
      if (o === c || o._dead || o.laneKey !== c.laneKey) continue;
      const dist = c.dir === 'right' ? o.x - c.x :
                   c.dir === 'left' ? c.x - o.x :
                   c.dir === 'down' ? o.y - c.y :
                   c.y - o.y;
      if (dist > 0 && dist < bestDist) {
        bestDist = dist;
        best = o;
      }
    }
    return best;
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, W, H);

    // Background
    const vg = ctx.createRadialGradient(W/2, H/2, 200, W/2, H/2, 800);
    vg.addColorStop(0, '#101524');
    vg.addColorStop(1, '#05070a');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    // Draw Roads
    ctx.fillStyle = '#171f2e';
    // NS A Road
    ctx.fillRect(cxA - crossHalfNS, 0, roadW_NS, H);
    // NS B Road
    ctx.fillRect(cxB - crossHalfNS, 0, roadW_NS, H);

    // EW Road Highlight
    ctx.fillStyle = '#1c283d';
    ctx.shadowColor = 'rgba(77, 215, 255, 0.8)';
    ctx.shadowBlur = 30;
    ctx.fillRect(0, cy - crossHalfEW, W, roadW_EW);
    ctx.shadowBlur = 0;

    // EW Road Borders
    ctx.strokeStyle = 'rgba(77, 215, 255, 1)';
    ctx.lineWidth = 4;
    ctx.shadowColor = 'rgba(77, 215, 255, 0.8)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(0, cy - crossHalfEW); ctx.lineTo(W, cy - crossHalfEW);
    ctx.moveTo(0, cy + crossHalfEW); ctx.lineTo(W, cy + crossHalfEW);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw Lanes
    ctx.fillStyle = '#27314a';
    for (let i = 0; i < lanesPerDirEW; i++) {
      const offset = getLaneOffset(i, lanesPerDirEW);
      ctx.fillRect(0, cy + laneW/2 + laneGap/2 + offset - laneW/2, W, laneW);
      ctx.fillRect(0, cy - laneW/2 - laneGap/2 - offset - laneW/2, W, laneW);
    }
    for (let i = 0; i < lanesPerDirNS; i++) {
      const offset = getLaneOffset(i, lanesPerDirNS);
      ctx.fillRect(cxA + laneW/2 + laneGap/2 + offset - laneW/2, 0, laneW, H);
      ctx.fillRect(cxA - laneW/2 - laneGap/2 - offset - laneW/2, 0, laneW, H);

      ctx.fillRect(cxB + laneW/2 + laneGap/2 + offset - laneW/2, 0, laneW, H);
      ctx.fillRect(cxB - laneW/2 - laneGap/2 - offset - laneW/2, 0, laneW, H);
    }

    // Stop Lines A
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(cxA - crossHalfNS, cy - stopLineOffsetNS); ctx.lineTo(cxA + crossHalfNS, cy - stopLineOffsetNS); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cxA - crossHalfNS, cy + stopLineOffsetNS); ctx.lineTo(cxA + crossHalfNS, cy + stopLineOffsetNS); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cxA - stopLineOffsetEW, cy - crossHalfEW); ctx.lineTo(cxA - stopLineOffsetEW, cy + crossHalfEW); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cxA + stopLineOffsetEW, cy - crossHalfEW); ctx.lineTo(cxA + stopLineOffsetEW, cy + crossHalfEW); ctx.stroke();

    // Stop Lines B
    ctx.beginPath(); ctx.moveTo(cxB - crossHalfNS, cy - stopLineOffsetNS); ctx.lineTo(cxB + crossHalfNS, cy - stopLineOffsetNS); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cxB - crossHalfNS, cy + stopLineOffsetNS); ctx.lineTo(cxB + crossHalfNS, cy + stopLineOffsetNS); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cxB - stopLineOffsetEW, cy - crossHalfEW); ctx.lineTo(cxB - stopLineOffsetEW, cy + crossHalfEW); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cxB + stopLineOffsetEW, cy - crossHalfEW); ctx.lineTo(cxB + stopLineOffsetEW, cy + crossHalfEW); ctx.stroke();

    // Draw Cars
    for (const c of carsRef.current) {
      if (c._dead) continue;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.fillStyle = c.color;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 8;
      
      ctx.beginPath();
      ctx.roundRect(-c.w/2, -c.h/2, c.w, c.h, 4);
      ctx.fill();
      
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      if (c.axis === 'EW') ctx.fillRect(-c.w/2+2, -c.h/2+2, 4, c.h-4);
      else ctx.fillRect(-c.w/2+2, -c.h/2+2, c.w-4, 4);

      if (c.isPlatoon) {
         ctx.fillStyle = '#fff';
         ctx.font = 'bold 18px sans-serif';
         ctx.textAlign = 'center';
         ctx.textBaseline = 'middle';
         // Rotate text if car is vertical to always be readable, or just keep it simple
         if (c.axis === 'EW') {
            ctx.fillText(c.platoonSize?.toString() || '', 0, 0);
         } else {
            ctx.save();
            ctx.rotate(Math.PI / 2);
            ctx.fillText(c.platoonSize?.toString() || '', 0, 0);
            ctx.restore();
         }
      }
      
      ctx.restore();
    }

    // Draw Lights
    drawIntersectionLight(ctx, cxA, cy, 'A', getStateA('EW'), getStateA('NS'), stateA.current.timer);
    drawIntersectionLight(ctx, cxB, cy, 'B', getStateB('EW'), getStateB('NS'), stateB.current.timer);
  };

  const drawIntersectionLight = (ctx: CanvasRenderingContext2D, cx: number, cy: number, name: string, ewState: string, nsState: string, timer: number) => {
    const marginX = crossHalfNS + 45;
    const marginY = crossHalfEW + 45;
    drawLightBox(ctx, cx - marginX, cy + marginY, ewState, timer, 'EW', name);
    drawLightBox(ctx, cx + marginX, cy - marginY, ewState, timer, 'EW', name);
    drawLightBox(ctx, cx - marginX, cy - marginY, nsState, timer, 'NS', name);
    drawLightBox(ctx, cx + marginX, cy + marginY, nsState, timer, 'NS', name);
  };

  const drawLightBox = (ctx: CanvasRenderingContext2D, x: number, y: number, state: string, timer: number, type: string, name: string) => {
    ctx.save();
    ctx.translate(x, y);
    
    const boxW = 45, boxH = 105;
    ctx.fillStyle = '#080c16';
    ctx.beginPath(); ctx.roundRect(-boxW/2, -boxH/2, boxW, boxH, 12); ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 3; ctx.stroke();

    const r = 12;
    const drawBulb = (by: number, color: string, isOn: boolean) => {
      ctx.fillStyle = isOn ? color : '#111';
      ctx.shadowColor = color;
      ctx.shadowBlur = isOn ? 22 : 0;
      ctx.beginPath(); ctx.arc(0, by, r, 0, Math.PI*2); ctx.fill();
    };

    drawBulb(-30, '#ff4d5a', state === 'RED');
    drawBulb(0, '#ffd36a', state === 'YELLOW');
    drawBulb(30, '#2cff86', state === 'GREEN');

    // Timer text
    if (type === 'EW') {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 25px monospace'; // +20% from 21px
      ctx.textAlign = 'center';
      
      // Glow effect for the numbers
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 10;
      ctx.fillText(timer.toString(), 0, boxH/2 + 25);
      
      ctx.shadowBlur = 0; // reset for the name text
      ctx.fillStyle = '#aaa';
      ctx.font = '15px sans-serif';
      ctx.fillText(name, 0, boxH/2 + 45);
    }
    
    ctx.restore();
  };

  return (
    <div className="w-full flex flex-col justify-center bg-[#05070a] md:rounded-2xl border-y md:border border-slate-800 shadow-2xl overflow-hidden p-0 md:p-4">
      {/* Mobile rotated view (Vertical Layout) */}
      <div className="block md:hidden relative w-full bg-[#05070a] overflow-hidden" style={{ aspectRatio: `${H} / ${W}` }}>
         <canvas 
           ref={canvasRefMobile}
           width={W} 
           height={H} 
           className="absolute top-1/2 left-1/2 origin-center bg-black"
           style={{
             width: `${(W / H) * 100}%`,
             height: `${(H / W) * 100}%`,
             transform: 'translate(-50%, -50%) rotate(90deg)',
           }}
         />
      </div>

      {/* Desktop normal view (Horizontal Layout) */}
      <div className="hidden md:block w-full">
        <canvas ref={canvasRef} width={W} height={H} className="max-w-full h-auto bg-black rounded-xl mx-auto block" />
      </div>
    </div>
  );
});
