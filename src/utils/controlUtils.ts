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

export function changePan(
  ctx: AudioContext,
  panVal: number,
  stereoPanner: StereoPannerNode
) {
  stereoPanner.pan.setValueAtTime(stereoPanner.pan.value, ctx.currentTime);
  stereoPanner.pan.linearRampToValueAtTime(panVal, ctx.currentTime + 0.005);
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
