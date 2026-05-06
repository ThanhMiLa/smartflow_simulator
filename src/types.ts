export type LightState = 'GREEN' | 'RED';
export type LogType = 'info' | 'warning' | 'error' | 'success';

export interface LogEntry {
  id: number;
  time: string;
  msg: string;
  type: LogType;
}

export interface Platoon {
  id: number;
  count: number;
  remaining: number;
}

export interface SystemConfig {
  x: number;
  distance: number;
  speed: number;
}