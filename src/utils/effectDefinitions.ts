/*
    List of available audio effects and their control attributes
*/

import { getCentreFrequency } from "./audioUtils";

export const panEffect = {
  name: "pan",
  controlType: "range",
  params: [
    {
      name: "panValue",
      min: -1,
      max: 1,
      step: 0.01,
      value: 0,
    },
  ],
};

export const delayEffect = {
  name: "delay",
  controlType: "range",
  params: [
    {
      name: "delayTime",
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.5,
    },
  ],
};

export const lowpassEffect = {
  name: "lowpass",
  controlType: "range",
  params: [
    {
      name: "frequency",
      min: 20,
      max: 15000,
      step: 1,
      value: 15000,
    },
  ],
};

export const highpassEffect = {
  name: "highpass",
  controlType: "range",
  params: [
    {
      name: "frequency",
      min: 20,
      max: 15000,
      step: 1,
      value: 20,
    },
  ],
};

export const bandpassEffect = {
  name: "bandpass",
  controlType: "range",
  params: [
    {
      name: "frequency",
      min: 20,
      max: 15000,
      step: 1,
      value: getCentreFrequency(20, 15000),
    },
    {
      name: "bpQ",
      min: 1,
      max: 100,
      step: 0.1,
      value: 1,
    },
  ],
};
