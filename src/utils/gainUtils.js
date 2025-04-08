export function createGainNode(ctx) {
  const gainNode = ctx.createGain();
  return gainNode;
}

export function changeGain(ctx, gainVal, muted, gainNode) {
  if (!muted) {
    gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + 0.05);
  }
}

export function mute(ctx, gainNode) {
  gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);
}
