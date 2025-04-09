export function createOscillator(ctx: AudioContext): OscillatorNode {
  const osc = ctx.createOscillator();
  return osc;
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
