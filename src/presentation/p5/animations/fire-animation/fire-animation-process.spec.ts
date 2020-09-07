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
    fireAnimation.createFireSource(animationSize.width)
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

  test('Should decay from 36 to the minimum 0', () => {
    const animationSize: AnimationSize = { height: 38, width: 10 }
    const fireAnimation = new FireAnimationProcess(animationSize)
    const sourceLength = animationSize.width
    fireAnimation.createFireDataStructure()
    fireAnimation.createFireSource(sourceLength)
    const unitaryDecay = { decay: 1, intrinsicTurbulence: 0, windTurbulence: 0 }
    for (let round = 0; round < 40; round++) {
      for (let column = 0; column < animationSize.width; column++) {
        for (let row = 0; row < animationSize.height; row++) {
          const currentFireCellIndex = column + (animationSize.width * row)
          fireAnimation.updateFireIntensityPerFireCell(currentFireCellIndex, unitaryDecay)
        }
      }
    }
    expect(fireAnimation.fireProcessArray.slice(0, animationSize.width))
      .toEqual(Array(animationSize.width).fill(0))
    expect(fireAnimation.fireProcessArray.slice(animationSize.width, 2 * animationSize.width))
      .toEqual(Array(animationSize.width).fill(0))
    expect(fireAnimation.fireProcessArray.slice(2 * animationSize.width, 3 * animationSize.width))
      .toEqual(Array(animationSize.width).fill(1))
  })

  test('Should generateRandomBehavior generate random values', () => {
    const animationSize: AnimationSize = { height: 38, width: 500 }
    const sourceLength = animationSize.width

    const fireAnimationDeterministic = new FireAnimationProcess(animationSize)
    fireAnimationDeterministic.createFireDataStructure()
    fireAnimationDeterministic.createFireSource(sourceLength)
    const unitaryDecay = { decay: 1, intrinsicTurbulence: 0, windTurbulence: 0 }
    for (let round = 0; round < 40; round++) {
      for (let column = 0; column < animationSize.width; column++) {
        for (let row = 0; row < animationSize.height; row++) {
          const currentFireCellIndex = column + (animationSize.width * row)
          fireAnimationDeterministic.updateFireIntensityPerFireCell(currentFireCellIndex, unitaryDecay)
        }
      }
    }

    const fireAnimationRandom = new FireAnimationProcess(animationSize)
    fireAnimationRandom.createFireDataStructure()
    fireAnimationRandom.createFireSource(sourceLength)
    for (let round = 0; round < 40; round++) {
      fireAnimationRandom.calculeteFirePropagation()
    }

    const fireAnimationRandom2 = new FireAnimationProcess(animationSize)
    fireAnimationRandom2.createFireDataStructure()
    fireAnimationRandom2.createFireSource(sourceLength)
    for (let round = 0; round < 40; round++) {
      fireAnimationRandom2.calculeteFirePropagation()
    }

    expect(fireAnimationRandom.fireProcessArray)
      .not.toEqual(fireAnimationDeterministic.fireProcessArray)
    expect(fireAnimationRandom2.fireProcessArray)
      .not.toEqual(fireAnimationDeterministic.fireProcessArray)
    expect(fireAnimationRandom.fireProcessArray)
      .not.toEqual(fireAnimationRandom2.fireProcessArray)
  })
})
