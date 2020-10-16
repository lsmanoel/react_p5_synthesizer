import { Synthesizer } from '@/presentation/p5/animations/synthesizer/synthesizer'

export const makeSynthesizer = (): Synthesizer => {
  return new Synthesizer(
    { height: window.innerHeight, width: window.innerWidth }, // animationSize
    25 // frameRate
  )
}
