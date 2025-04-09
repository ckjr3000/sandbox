/*

Custom Types for the project

*/

export interface OscInstance {
  type: string;
  osc: OscillatorNode;
  gainNode: GainNode;
  stereoPanner: StereoPannerNode;
}

export interface NoiseInstance {
  noiseSource: AudioBufferSourceNode;
  gainNode: GainNode;
}
