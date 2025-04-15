/*

Custom Types for the project

*/

export interface OscInstance {
  type: string;
  osc: OscillatorNode;
  gainNode: GainNode;
}

export interface NoiseInstance {
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
