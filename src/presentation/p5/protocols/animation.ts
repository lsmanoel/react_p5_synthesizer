import p5 from 'p5'

export type AnimationSize = {
  height: number
  width: number
}

export interface Animation {
  myP5: p5
  animationSize: AnimationSize

  sketch (p: p5): void
  build (ref: HTMLElement): void
}
