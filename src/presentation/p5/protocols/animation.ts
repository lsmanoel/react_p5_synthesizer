import p5 from 'p5'

export type WindowSize = {
  height: number
  width: number
}

export interface Animation {
  myP5: p5
  windowSize: WindowSize

  sketch (p: p5): void
  build (ref: HTMLElement): void
}
