export function createGainNode(ctx: AudioContext): GainNode {
  const gainNode = ctx.createGain();
  return gainNode;
}

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
