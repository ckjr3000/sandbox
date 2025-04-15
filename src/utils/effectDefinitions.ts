/*
    List of available audio effects and their control attributes
*/

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
      value: 1,
    },
  ],
};

export const lowpassEffect = {
  name: "lowpass",
  controlType: "range",
  params: [
    {
      name: "frequency",
      min: 0,
      max: 1,
      step: 0.01,
      value: 1,
    },
  ],
};

export const highpassEffect = {
  name: "highpass",
  controlType: "range",
  params: [
    {
      name: "frequency",
      min: 0,
      max: 1,
      step: 0.01,
      value: 1,
    },
  ],
};

export const bandpassEffect = {
  name: "bandpass",
  controlType: "range",
  params: [
    {
      name: "frequency",
      min: 0,
      max: 1,
      step: 0.01,
      value: 1,
    },
    {
      name: "q",
      min: 0,
      max: 1,
      step: 0.01,
      value: 1,
    },
  ],
};
