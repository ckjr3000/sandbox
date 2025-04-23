/*

Custom Types for the project

*/

export interface OscInstance {
  id: number;
  type: string;
  osc: OscillatorNode;
  gainNode: GainNode;
}

export interface NoiseInstance {
  id: number;
  noiseSource: AudioBufferSourceNode;
  gainNode: GainNode;
}

export interface RangeEffectParameter {
  name: string;
  min: number;
  max: number;
  default: number;
  step: number;
  value: number;
}

export interface Effect {
  name: string;
  controlType: "range" | "select";
  params?: RangeEffectParameter[]; // for range
  options?: string[]; // for select
}

export interface AutomationValues {
  min: string;
  max: string;
  speed: string;
}

/* 
  These are set to numbers despite the range input expecting strings 
*/
export interface RangeInputAttributes {
  min: string;
  max: string;
  step: string;
  value: string;
}
