export function createPanner(ctx) {
  const stereoPanner = ctx.createStereoPanner();
  return stereoPanner;
}

export function changePan(ctx, panVal, stereoPanner) {
  stereoPanner.pan.setValueAtTime(stereoPanner.pan.value, ctx.currentTime);
  stereoPanner.pan.linearRampToValueAtTime(panVal, ctx.currentTime + 0.005);
}
