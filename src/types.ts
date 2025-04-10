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
