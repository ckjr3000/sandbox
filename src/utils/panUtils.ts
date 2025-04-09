export function createPanner(ctx: AudioContext): StereoPannerNode {
  const stereoPanner = ctx.createStereoPanner();
  return stereoPanner;
}

export function changePan(
  ctx: AudioContext,
  panVal: number,
  stereoPanner: StereoPannerNode
) {
  stereoPanner.pan.setValueAtTime(stereoPanner.pan.value, ctx.currentTime);
  stereoPanner.pan.linearRampToValueAtTime(panVal, ctx.currentTime + 0.005);
}
