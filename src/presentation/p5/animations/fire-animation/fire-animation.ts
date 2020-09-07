import p5 from 'p5'
import { Animation, AnimationSize } from '@/presentation/p5/protocols/animation'
import { FireAnimationProcess } from './fire-animation-process'

export class FireAnimation implements Animation {
  constructor (
    readonly animationSize: AnimationSize,
    readonly pixelDensity: number = 1,
    readonly frameRate: number = 30,
    ascendantDecay: number = 2,
    sideWind: number = 1,
    spreading: number = 2,
    sourceLength: number = -1
  ) {
    this.ascendantDecay = ascendantDecay
    this.sideWind = sideWind
    this.spreading = spreading
    if (sourceLength < 0) {
      this.sourceLength = animationSize.width - 36
    } else {
      this.sourceLength = sourceLength
    }
  }

  myP5: p5
  fireAnimationProcess: FireAnimationProcess
  fireProcessArray: number[]
  _ascendantDecay: number
  sideWind: number
  spreading: number
  sourceLength: number

  set ascendantDecay (inputValue: number) {
    if (inputValue < 2) {
      inputValue = 2
    }
    this._ascendantDecay = inputValue
  }

  sketch = (p: p5): void => {
    p.setup = () => {
      p.createCanvas(this.pixelDensity * this.animationSize.width, this.pixelDensity * this.animationSize.height)
      p.frameRate(this.frameRate)
      p.pixelDensity(1)
      p.loadPixels()

      this.fireAnimationProcess = new FireAnimationProcess(
        this.animationSize,
        p.pixels,
        this.pixelDensity,
        this._ascendantDecay,
        this.sideWind,
        this.spreading,
        this.sourceLength
      )

      this.fireAnimationProcess.build()
      p.updatePixels()
    }

    p.draw = () => {
      this.fireAnimationProcess.calculeteFirePropagation()
      this.fireAnimationProcess.renderRGBAFire()
      p.updatePixels()
    }
  }

  build = (currentRef: HTMLElement): void => {
    // eslint-disable-next-line new-cap
    this.myP5 = new p5(this.sketch, currentRef)
  }
}
