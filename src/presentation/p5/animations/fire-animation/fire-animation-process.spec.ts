import { AnimationSize } from '@/presentation/p5/protocols/animation'
import { FireAnimationProcess } from './fire-animation-process'

describe('FireAnimationProcess', () => {
  test('Should start with correct fireProcessArray length', () => {
    const animationSize: AnimationSize = { height: 300, width: 199 }
    const fireAnimation = new FireAnimationProcess(animationSize)
    fireAnimation.createFireDataStructure()
    expect(fireAnimation.fireProcessArray.length)
      .toBe(animationSize.width * animationSize.height)
  })

  test('Should start with fire source value 36', () => {
    const animationSize: AnimationSize = { height: 10, width: 10 }
    const fireAnimation = new FireAnimationProcess(animationSize)
    fireAnimation.createFireDataStructure()
    fireAnimation.createFireSource()
    expect(fireAnimation.fireProcessArray.slice(fireAnimation.fireProcessArray.length - animationSize.width, fireAnimation.fireProcessArray.length))
      .toEqual(Array(animationSize.width).fill(36))
  })

  test('Should start with fire source value 36 and sourceLength<fireProcessArray.width', () => {
    const animationSize: AnimationSize = { height: 10, width: 10 }
    const fireAnimation = new FireAnimationProcess(animationSize)
    const sourceLength = Math.trunc(animationSize.width / 4)
    fireAnimation.createFireDataStructure()
    fireAnimation.createFireSource(sourceLength)
    expect(fireAnimation.fireProcessArray.slice(
      fireAnimation.fireProcessArray.length - Math.trunc(animationSize.width / 2) - Math.trunc(sourceLength / 2),
      fireAnimation.fireProcessArray.length - Math.ceil(animationSize.width / 2) + Math.ceil(sourceLength / 2)
    ))
      .toEqual(Array(sourceLength).fill(36))
  })
})
