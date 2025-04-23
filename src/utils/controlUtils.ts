/*
    Event handlers for value changes on audio effects
*/

import { AutomationValues } from "@/types";

export function changeGain(
  ctx: AudioContext,
  gainVal: number,
  muted: boolean,
  gainNode: GainNode
) {
  if (!muted) {
    gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + 0.05);
  }
}

export function mute(ctx: AudioContext, gainNode: GainNode) {
  gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);
}

export function changeFreq(
  ctx: AudioContext,
  freqVal: number,
  oscillatorNode: OscillatorNode
) {
  oscillatorNode.frequency.linearRampToValueAtTime(
    freqVal,
    ctx.currentTime + 0.05
  );
}

export function changePan(
  ctx: AudioContext,
  panVal: number,
  stereoPanner: StereoPannerNode
) {
  stereoPanner.pan.setValueAtTime(stereoPanner.pan.value, ctx.currentTime);
  stereoPanner.pan.linearRampToValueAtTime(panVal, ctx.currentTime + 0.5);
}

export function changeDelay(
  ctx: AudioContext,
  delayTime: number,
  delayNode: DelayNode
) {
  delayNode.delayTime.setValueAtTime(
    delayNode.delayTime.value,
    ctx.currentTime
  );
  delayNode.delayTime.linearRampToValueAtTime(
    delayTime,
    ctx.currentTime + 0.05
  );
}

export function changeFilterFrequency(
  ctx: AudioContext,
  filterFreq: number,
  filterNode: BiquadFilterNode
) {
  filterNode.frequency.setValueAtTime(
    filterNode.frequency.value,
    ctx.currentTime
  );
  filterNode.frequency.linearRampToValueAtTime(
    filterFreq,
    ctx.currentTime + 0.05
  );
}

export function changeFilterQ(
  ctx: AudioContext,
  filterQ: number,
  filterNode: BiquadFilterNode
) {
  filterNode.Q.setValueAtTime(filterNode.Q.value, ctx.currentTime);
  filterNode.Q.linearRampToValueAtTime(filterQ, ctx.currentTime + 0.05);
}

/*
  Event handlers for value changes on automation controls
*/

export function randomJump(
  updateInput: (value: number) => void,
  automationValues: AutomationValues
) {
  const min = parseFloat(automationValues.min);
  const max = parseFloat(automationValues.max);
  const speed = parseFloat(automationValues.speed);

  setInterval(() => {
    const randomVal = Math.random() * (max - min) + min;
    updateInput(randomVal);
  }, speed);
}
