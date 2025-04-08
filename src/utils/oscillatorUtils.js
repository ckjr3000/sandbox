export function createOscillator(ctx) {
  const osc = ctx.createOscillator();
  return osc;
}

export function changeFreq(ctx, freqVal, oscillatorNode) {
  oscillatorNode.frequency.linearRampToValueAtTime(
    freqVal,
    ctx.currentTime + 0.05
  );
}
