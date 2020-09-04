import p5 from 'p5'
import { Animation, AnimationSize } from '@/presentation/p5/protocols/animation'

export class FireAnimation implements Animation {
  constructor (readonly animationSize: AnimationSize) {}
  myP5: p5

  sketch = (p: p5): void => {
    p.setup = () => {
      p.createCanvas(this.animationSize.width, this.animationSize.height)
    }

    p.draw = () => {
      p.background(0)
      p.fill(255)
      p.rect(200, 200, 50, 50)
    }
  }

  build = (currentRef: HTMLElement): void => {
    // eslint-disable-next-line new-cap
    this.myP5 = new p5(this.sketch, currentRef)
  }
}
