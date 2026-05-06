import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import type { LightState } from '../types';

export interface SimulatorRef {
  spawnTestPlatoon: (K: number) => void;
  getWaitingCarsA: () => number;
  getWaitingCarsB: () => number;
}

interface Props {
  lightA: LightState;
  timerA: number;
  lightB: LightState;
  timerB: number;
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
}

const W = 1200;
const H = 600;
const cxA = 300;
const cxB = 900;
const cy = 300;
const OFFSET = 36; // seconds
const DISTANCE = cxB - cxA;
const BASE_SPEED = DISTANCE / OFFSET; // px/s (~16.6)

const lanesPerDir = 2;
const laneW = 20;
const laneGap = 4;
const roadMargin = 12;
const roadW = roadMargin * 2 + lanesPerDir * laneW * 2 + laneGap * (lanesPerDir * 2 - 1);
const crossHalf = roadW / 2;
const stopLineOffset = crossHalf + 10;
const stopPad = 5;

const colorsCars = ['#79a8ff','#ff8b94','#7fffd4','#ffd36a','#c084fc','#a3e635','#fb7185','#60a5fa','#22c55e','#f97316','#38bdf8','#e879f9'];

export const SimulatorCanvas = forwardRef<SimulatorRef, Props>(({ lightA, timerA, lightB, timerB }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const carsRef = useRef<Car[]>([]);
  const idGenRef = useRef(0);
  const spawnAccRef = useRef(0);
  
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

  const getLaneOffset = (i: number) => {
    const step = laneW + laneGap;
    const mid = (lanesPerDir - 1) / 2;
    return (i - mid) * step;
  };

  useImperativeHandle(ref, () => ({
    spawnTestPlatoon: (K: number) => {
      // Sinh K xe liên tục bên ngoài màn hình, xếp hàng chờ đèn A
      const newCars: Car[] = [];
      const lanes = [0, 1];
      for (let i = 0; i < K; i++) {
        const laneIndex = lanes[i % lanes.length];
        const offset = getLaneOffset(laneIndex);
        const yW2E = cy + (laneW / 2 + laneGap / 2) + (laneW + laneGap) * (lanesPerDir - 1) / 2 + offset;
        
        newCars.push({
          id: idGenRef.current++,
          axis: 'EW', dir: 'right', laneKey: `EW_right_${laneIndex}`,
          x: cxA - stopLineOffset - 20 - (Math.floor(i / lanes.length) * 30), // Xếp lùi dần
          y: yW2E, w: 24, h: 12,
          speed: BASE_SPEED * (0.9 + Math.random() * 0.2),
          vel: 0, maxAccel: 50,
          color: colorsCars[idGenRef.current % colorsCars.length],
          passedA: false, passedB: false, _dead: false
        });
      }
      carsRef.current.push(...newCars);
    },
    getWaitingCarsA: () => {
      // Đếm xe chiều EW đang đứng chờ trước ngã tư A (khoảng cách check 800px)
      return carsRef.current.filter(c => c.axis === 'EW' && c.dir === 'right' && c.vel < 5 && c.x > cxA - stopLineOffset - 800 && c.x <= cxA - stopLineOffset).length;
    },
    getWaitingCarsB: () => {
      // Đếm xe chiều EW đang đứng chờ trước ngã tư B
      return carsRef.current.filter(c => c.axis === 'EW' && c.dir === 'right' && c.vel < 5 && c.x > cxB - stopLineOffset - 800 && c.x <= cxB - stopLineOffset).length;
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastT = performance.now();
    let animFrameId: number;

    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - lastT) / 1000);
      lastT = t;

      updatePhysics(dt);
      draw(ctx);

      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameId);
  }, []);

  // --- Sinh xe tự động xen kẽ ---
  const spawnRandom = (dt: number) => {
    const rate = 0.5; // xe mỗi giây (nền)
    spawnAccRef.current += dt * rate;
    while (spawnAccRef.current >= 1) {
      spawnAccRef.current -= 1;
      const r = Math.random();
      const laneIndex = Math.floor(Math.random() * lanesPerDir);
      const offset = getLaneOffset(laneIndex);
      
      const speed = BASE_SPEED * (0.8 + Math.random() * 0.4);
      const color = colorsCars[(idGenRef.current++) % colorsCars.length];

      let turnDecision: 'straight' | 'right' = 'straight';

      if (laneIndex === 1 && Math.random() < 0.3) {
         turnDecision = 'right';
      }

      let car: Partial<Car> = { id: idGenRef.current, speed, vel: speed, maxAccel: 60, color, _dead: false, passedA: false, passedB: false, turnDecision };
      
      if (r < 0.16) { // NS_A down
        car.axis = 'NS_A'; car.dir = 'down'; car.laneKey = `NSA_down_${laneIndex}`;
        car.w = 12; car.h = 24; car.x = cxA - (laneW / 2 + laneGap / 2) - (laneW + laneGap) * (lanesPerDir - 1) / 2 + offset; car.y = -50;
        if (turnDecision === 'right') car.turnTarget = 'A';
      } else if (r < 0.32) { // NS_A up
        car.axis = 'NS_A'; car.dir = 'up'; car.laneKey = `NSA_up_${laneIndex}`;
        car.w = 12; car.h = 24; car.x = cxA + (laneW / 2 + laneGap / 2) + (laneW + laneGap) * (lanesPerDir - 1) / 2 + offset; car.y = H + 50;
        if (turnDecision === 'right') car.turnTarget = 'A';
      } else if (r < 0.48) { // NS_B down
        car.axis = 'NS_B'; car.dir = 'down'; car.laneKey = `NSB_down_${laneIndex}`;
        car.w = 12; car.h = 24; car.x = cxB - (laneW / 2 + laneGap / 2) - (laneW + laneGap) * (lanesPerDir - 1) / 2 + offset; car.y = -50;
        if (turnDecision === 'right') car.turnTarget = 'B';
      } else if (r < 0.64) { // NS_B up
        car.axis = 'NS_B'; car.dir = 'up'; car.laneKey = `NSB_up_${laneIndex}`;
        car.w = 12; car.h = 24; car.x = cxB + (laneW / 2 + laneGap / 2) + (laneW + laneGap) * (lanesPerDir - 1) / 2 + offset; car.y = H + 50;
        if (turnDecision === 'right') car.turnTarget = 'B';
      } else if (r < 0.82) { // EW left
        car.axis = 'EW'; car.dir = 'left'; car.laneKey = `EW_left_${laneIndex}`;
        car.w = 24; car.h = 12; car.x = W + 50; car.y = cy - (laneW / 2 + laneGap / 2) - (laneW + laneGap) * (lanesPerDir - 1) / 2 + offset;
        if (turnDecision === 'right') car.turnTarget = Math.random() < 0.5 ? 'A' : 'B';
      } else { // EW right
        car.axis = 'EW'; car.dir = 'right'; car.laneKey = `EW_right_${laneIndex}`;
        car.w = 24; car.h = 12; car.x = -50; car.y = cy + (laneW / 2 + laneGap / 2) + (laneW + laneGap) * (lanesPerDir - 1) / 2 + offset;
        if (turnDecision === 'right') car.turnTarget = Math.random() < 0.5 ? 'A' : 'B';
      }
      
      carsRef.current.push(car as Car);
    }
  };

  const updatePhysics = (dt: number) => {
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
            targetStop = cxA - stopLineOffset;
            if (getStateA('EW') !== 'GREEN' && c.x + c.w/2 >= targetStop - stopPad) needStop = true;
            if (c.x > cxA + 10) c.passedA = true;
          } else if (!c.passedB) {
            targetStop = cxB - stopLineOffset;
            if (getStateB('EW') !== 'GREEN' && c.x + c.w/2 >= targetStop - stopPad) needStop = true;
            if (c.x > cxB + 10) c.passedB = true;
          }
        } else { // left
          if (!c.passedB) {
            targetStop = cxB + stopLineOffset;
            if (getStateB('EW') !== 'GREEN' && c.x - c.w/2 <= targetStop + stopPad) needStop = true;
            if (c.x < cxB - 10) c.passedB = true;
          } else if (!c.passedA) {
            targetStop = cxA + stopLineOffset;
            if (getStateA('EW') !== 'GREEN' && c.x - c.w/2 <= targetStop + stopPad) needStop = true;
            if (c.x < cxA - 10) c.passedA = true;
          }
        }
      } else if (c.axis === 'NS_A') {
        const state = getStateA('NS');
        if (c.dir === 'down') {
          targetStop = cy - stopLineOffset;
          if (state !== 'GREEN' && c.y + c.h/2 >= targetStop - stopPad && !c.passedA) needStop = true;
          if (c.y > cy + 10) c.passedA = true;
        } else {
          targetStop = cy + stopLineOffset;
          if (state !== 'GREEN' && c.y - c.h/2 <= targetStop + stopPad && !c.passedA) needStop = true;
          if (c.y < cy - 10) c.passedA = true;
        }
      } else if (c.axis === 'NS_B') {
        const state = getStateB('NS');
        if (c.dir === 'down') {
          targetStop = cy - stopLineOffset;
          if (state !== 'GREEN' && c.y + c.h/2 >= targetStop - stopPad && !c.passedB) needStop = true;
          if (c.y > cy + 10) c.passedB = true;
        } else {
          targetStop = cy + stopLineOffset;
          if (state !== 'GREEN' && c.y - c.h/2 <= targetStop + stopPad && !c.passedB) needStop = true;
          if (c.y < cy - 10) c.passedB = true;
        }
      }

      // Vị trí khi cần dừng
      if (needStop) {
        if (c.dir === 'right') c.x = Math.min(c.x, targetStop - stopPad - c.w/2);
        if (c.dir === 'left') c.x = Math.max(c.x, targetStop + stopPad + c.w/2);
        if (c.dir === 'down') c.y = Math.min(c.y, targetStop - stopPad - c.h/2);
        if (c.dir === 'up') c.y = Math.max(c.y, targetStop + stopPad + c.h/2);
      }

      // Check Turn
      if (c.turnDecision === 'right' && c.turnTarget) {
         const cxTarget = c.turnTarget === 'B' ? cxB : cxA;
         if (c.dir === 'right' && c.x >= cxTarget - 24) {
            c.dir = 'down'; c.axis = c.turnTarget === 'B' ? 'NS_B' : 'NS_A'; c.x = cxTarget - 24; c.w = 12; c.h = 24; c.turnDecision = 'straight';
         } else if (c.dir === 'left' && c.x <= cxTarget + 24) {
            c.dir = 'up'; c.axis = c.turnTarget === 'B' ? 'NS_B' : 'NS_A'; c.x = cxTarget + 24; c.w = 12; c.h = 24; c.turnDecision = 'straight';
         } else if (c.dir === 'down' && c.y >= cy - 24) {
            c.dir = 'left'; c.axis = 'EW'; c.y = cy - 24; c.w = 24; c.h = 12; c.turnDecision = 'straight'; c.passedA = (cxTarget === cxA); c.passedB = (cxTarget === cxB);
         } else if (c.dir === 'up' && c.y <= cy + 24) {
            c.dir = 'right'; c.axis = 'EW'; c.y = cy + 24; c.w = 24; c.h = 12; c.turnDecision = 'straight'; c.passedA = (cxTarget === cxA); c.passedB = (cxTarget === cxB);
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
    ctx.fillRect(cxA - crossHalf, 0, roadW, H);
    // NS B Road
    ctx.fillRect(cxB - crossHalf, 0, roadW, H);

    // EW Road Highlight
    ctx.fillStyle = '#1c283d';
    ctx.shadowColor = 'rgba(77, 215, 255, 0.4)';
    ctx.shadowBlur = 20;
    ctx.fillRect(0, cy - crossHalf, W, roadW);
    ctx.shadowBlur = 0;

    // Draw Lanes
    ctx.fillStyle = '#27314a';
    for (let i = 0; i < lanesPerDir; i++) {
      const offset = getLaneOffset(i);
      ctx.fillRect(0, cy + laneW/2 + laneGap/2 + offset - laneW/2, W, laneW);
      ctx.fillRect(0, cy - laneW/2 - laneGap/2 - offset - laneW/2, W, laneW);
      
      ctx.fillRect(cxA + laneW/2 + laneGap/2 + offset - laneW/2, 0, laneW, H);
      ctx.fillRect(cxA - laneW/2 - laneGap/2 - offset - laneW/2, 0, laneW, H);

      ctx.fillRect(cxB + laneW/2 + laneGap/2 + offset - laneW/2, 0, laneW, H);
      ctx.fillRect(cxB - laneW/2 - laneGap/2 - offset - laneW/2, 0, laneW, H);
    }

    // Stop Lines A
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(cxA - crossHalf, cy - stopLineOffset); ctx.lineTo(cxA + crossHalf, cy - stopLineOffset); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cxA - crossHalf, cy + stopLineOffset); ctx.lineTo(cxA + crossHalf, cy + stopLineOffset); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cxA - stopLineOffset, cy - crossHalf); ctx.lineTo(cxA - stopLineOffset, cy + crossHalf); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cxA + stopLineOffset, cy - crossHalf); ctx.lineTo(cxA + stopLineOffset, cy + crossHalf); ctx.stroke();

    // Stop Lines B
    ctx.beginPath(); ctx.moveTo(cxB - crossHalf, cy - stopLineOffset); ctx.lineTo(cxB + crossHalf, cy - stopLineOffset); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cxB - crossHalf, cy + stopLineOffset); ctx.lineTo(cxB + crossHalf, cy + stopLineOffset); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cxB - stopLineOffset, cy - crossHalf); ctx.lineTo(cxB - stopLineOffset, cy + crossHalf); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cxB + stopLineOffset, cy - crossHalf); ctx.lineTo(cxB + stopLineOffset, cy + crossHalf); ctx.stroke();

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
      
      ctx.restore();
    }

    // Draw Lights
    drawIntersectionLight(ctx, cxA, cy, 'A', getStateA('EW'), getStateA('NS'), stateA.current.timer);
    drawIntersectionLight(ctx, cxB, cy, 'B', getStateB('EW'), getStateB('NS'), stateB.current.timer);
  };

  const drawIntersectionLight = (ctx: CanvasRenderingContext2D, cx: number, cy: number, name: string, ewState: string, nsState: string, timer: number) => {
    const margin = crossHalf + 35;
    // We draw 4 lights per intersection. 
    // EW lights (Top-Center, Bottom-Center? No, Left, Right)
    drawLightBox(ctx, cx - margin, cy + margin, ewState, timer, 'EW', name);
    drawLightBox(ctx, cx + margin, cy - margin, ewState, timer, 'EW', name);
    drawLightBox(ctx, cx - margin, cy - margin, nsState, timer, 'NS', name);
    drawLightBox(ctx, cx + margin, cy + margin, nsState, timer, 'NS', name);
  };

  const drawLightBox = (ctx: CanvasRenderingContext2D, x: number, y: number, state: string, timer: number, type: string, name: string) => {
    ctx.save();
    ctx.translate(x, y);
    
    const boxW = 30, boxH = 70;
    ctx.fillStyle = '#080c16';
    ctx.beginPath(); ctx.roundRect(-boxW/2, -boxH/2, boxW, boxH, 8); ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.stroke();

    const r = 8;
    const drawBulb = (by: number, color: string, isOn: boolean) => {
      ctx.fillStyle = isOn ? color : '#111';
      ctx.shadowColor = color;
      ctx.shadowBlur = isOn ? 15 : 0;
      ctx.beginPath(); ctx.arc(0, by, r, 0, Math.PI*2); ctx.fill();
    };

    drawBulb(-20, '#ff4d5a', state === 'RED');
    drawBulb(0, '#ffd36a', state === 'YELLOW');
    drawBulb(20, '#2cff86', state === 'GREEN');

    // Timer text
    if (type === 'EW') {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 0;
      ctx.fillText(timer.toString(), 0, boxH/2 + 15);
      
      ctx.fillStyle = '#aaa';
      ctx.font = '10px sans-serif';
      ctx.fillText(name, 0, boxH/2 + 28);
    }
    
    ctx.restore();
  };

  return (
    <div className="w-full flex justify-center bg-[#05070a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden p-4">
      <canvas ref={canvasRef} width={W} height={H} className="max-w-full h-auto bg-black rounded-xl" />
    </div>
  );
});
