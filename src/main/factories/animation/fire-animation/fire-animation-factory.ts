import { FireAnimation } from '@/presentation/p5/animations/fire-animation/fire-animation'

export const makeFireAnimation = (): FireAnimation => {
  return new FireAnimation(
    { height: 100, width: 340 }, // animationSize
    3, // pixelDensity
    30, // frameRate
    1, // ascendantDecay
    1, // sideWind
    2, // spreading
    250, // sourceLength
    75 // sourceStart
  )
}
