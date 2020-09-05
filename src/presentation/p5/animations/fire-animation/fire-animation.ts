import p5 from 'p5'
import { Animation, AnimationSize } from '@/presentation/p5/protocols/animation'
import { FireAnimationProcess } from './fire-animation-process'

export class FireAnimation implements Animation {
  constructor (readonly animationSize: AnimationSize) {}
  myP5: p5
  fireAnimationProcess: FireAnimationProcess
  fireProcessArray: number[]

  sketch = (p: p5): void => {
    p.setup = () => {
      p.createCanvas(this.animationSize.width, this.animationSize.height)
      p.loadPixels()
      this.fireAnimationProcess = new FireAnimationProcess(this.animationSize)
      this.fireAnimationProcess.build(p.pixels, p.pixelDensity())
      p.updatePixels()
    }

    p.draw = () => {
      this.fireAnimationProcess.calculeteFirePropagation()
      this.fireAnimationProcess.renderRGBAFire(p.pixels, p.pixelDensity())
      p.updatePixels()
    }
  }

  build = (currentRef: HTMLElement): void => {
    // eslint-disable-next-line new-cap
    this.myP5 = new p5(this.sketch, currentRef)
  }
}
