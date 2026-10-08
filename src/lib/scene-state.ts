// Mutable, non-reactive state shared between the DOM and the WebGL render loop.
// Written by scroll/keyboard listeners and read every frame inside useFrame,
// so it deliberately avoids React state to keep re-renders at zero.
export const sceneState = {
  /** Continuous morph stage: 0 sphere, 1 knot, 2 wave, 3 helix, 4 galaxy */
  progress: 0,
  /** 0..1, ramps up when the Konami code fires */
  hyper: 0,
  hyperUntil: 0,
};

export const HYPER_EVENT = "kittikun:hyperdrive";

export function triggerHyperdrive(ms = 9000) {
  sceneState.hyperUntil = performance.now() + ms;
  window.dispatchEvent(new CustomEvent(HYPER_EVENT));
}
