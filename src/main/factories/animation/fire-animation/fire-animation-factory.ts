import { FireAnimation } from '@/presentation/p5/animations/fire-animation/fire-animation'

export const makeFireAnimation = (): FireAnimation => {
  return new FireAnimation(
    { height: 100, width: 340 },
    3,
    30,
    1,
    1,
    2,
    250,
    75)
}
