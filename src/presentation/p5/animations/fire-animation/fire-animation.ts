import p5 from 'p5'
import { Animation, AnimationSize } from '@/presentation/p5/protocols/animation'
import { FireAnimationProcess } from './fire-animation-process'

export class FireAnimation implements Animation {
  constructor (readonly animationSize: AnimationSize) {}
  myP5: p5
  fireAnimationProcess: FireAnimationProcess
  fireProcessArray: number[]

  sketch = (p: p5): void => {
    const pixelDensity = 5
    p.setup = () => {
      p.createCanvas(pixelDensity * this.animationSize.width, pixelDensity * this.animationSize.height)
      p.frameRate(30)
      p.pixelDensity(1)
      p.loadPixels()
      this.fireAnimationProcess = new FireAnimationProcess(this.animationSize)
      this.fireAnimationProcess.build(p.pixels, pixelDensity)
      p.updatePixels()
    }

    p.draw = () => {
      this.fireAnimationProcess.calculeteFirePropagation()
      this.fireAnimationProcess.renderRGBAFire(p.pixels, pixelDensity)
      p.updatePixels()
    }
  }

  build = (currentRef: HTMLElement): void => {
    // eslint-disable-next-line new-cap
    this.myP5 = new p5(this.sketch, currentRef)
  }
}
