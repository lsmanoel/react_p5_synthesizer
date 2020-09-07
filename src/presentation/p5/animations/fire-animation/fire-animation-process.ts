import { fireColorsPalette } from './fire-animation-colors-palette'
import { AnimationSize } from '../../protocols/animation'

type RandomBehaviors = {
  decay: number
  intrinsicTurbulence: number
  windTurbulence: number
}

export class FireAnimationProcess {
  constructor (
    fireProcessArraySize: AnimationSize,
    firePixelsRGBAArray: number[] = [],
    pixelDensity: number = 1,
    ascendantDecay: number = 2,
    sideWind: number = 1,
    spreading: number = 2,
    sourceLength: number = -1
  ) {
    if (fireProcessArraySize.width % 2) {
      fireProcessArraySize.width++
    }
    this.fireProcessArraySize = fireProcessArraySize
    this.firePixelsRGBAArray = firePixelsRGBAArray
    this.pixelDensity = pixelDensity
    this.screenLength = fireProcessArraySize.width * fireProcessArraySize.height
    this.ascendantDecay = ascendantDecay
    this.sideWind = sideWind
    this.spreading = spreading
    if (sourceLength < 0) {
      this.sourceLength = fireProcessArraySize.width - 36
    } else {
      this.sourceLength = sourceLength
    }
    this.build()
  }

  fireProcessArray: number[] = []
  fireProcessArraySize: AnimationSize
  firePixelsRGBAArray: number[]
  pixelDensity: number
  screenLength: number
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

  build = (firePixelsRGBAArray: number[] = this.firePixelsRGBAArray, pixelDensity: number = this.pixelDensity): void => {
    this.createFireDataStructure()
    this.createFireSource()
    this.renderRGBAFire()
  }

  createFireDataStructure = (): void => {
    for (let i = 0; i < this.screenLength; i++) {
      this.fireProcessArray[i] = 0
    }
  }

  createFireSource = (sourceLength: number = this.sourceLength): void => {
    const startSource = Math.trunc(this.fireProcessArraySize.width / 2) - Math.trunc(sourceLength / 2)
    const endSource = Math.ceil(this.fireProcessArraySize.width / 2) + Math.ceil(sourceLength / 2)
    for (let column = startSource; column < endSource; column++) {
      const overflowFireCellIndex = this.fireProcessArraySize.width * this.fireProcessArraySize.height
      const fireCellIndex = (overflowFireCellIndex - this.fireProcessArraySize.width) + column
      this.fireProcessArray[fireCellIndex] = 36
    }
  }

  calculeteFirePropagation = (updateFireIntensityPerFireCell: Function = this.updateFireIntensityPerFireCell): void => {
    for (let column = 0; column < this.fireProcessArraySize.width; column++) {
      for (let row = 0; row < this.fireProcessArraySize.height; row++) {
        const currentFireCellIndex = column + (this.fireProcessArraySize.width * row)
        updateFireIntensityPerFireCell(currentFireCellIndex)
      }
    }
  }

  generateRandomBehavior = (ascendantDecay: number = this._ascendantDecay, spreading: number = this.spreading, sideWind: number = this.sideWind): RandomBehaviors => {
    const decay = Math.floor(Math.random() * ascendantDecay)
    const intrinsicTurbulence = Math.floor(spreading * Math.random()) - Math.floor(spreading * Math.random())
    const windTurbulence = Math.floor(sideWind * Math.random())
    return { decay: decay, intrinsicTurbulence: intrinsicTurbulence, windTurbulence: windTurbulence }
  }

  updateFireIntensityPerFireCell = (currentFireCellIndex: number, randomBehaviors: RandomBehaviors = this.generateRandomBehavior()): void => {
    const belowFireCellIndex = currentFireCellIndex + this.fireProcessArraySize.width
    if (belowFireCellIndex >= this.fireProcessArraySize.width * this.fireProcessArraySize.height) {
      return
    }

    const { decay, intrinsicTurbulence, windTurbulence } = randomBehaviors

    const belowFireCellIntensity = this.fireProcessArray[belowFireCellIndex]
    const newFireIntensity = belowFireCellIntensity - decay >= 0 ? belowFireCellIntensity - decay : 0

    this.fireProcessArray[currentFireCellIndex + intrinsicTurbulence + windTurbulence] = newFireIntensity
  }

  renderRGBAFire = (firePixelsRGBAArray: number[] = this.firePixelsRGBAArray, pixelDensity: number = this.pixelDensity): void => {
    for (let fireProcessArrayRow = 0; fireProcessArrayRow < this.fireProcessArraySize.height; fireProcessArrayRow++) {
      for (let fireProcessArrayColumn = 0; fireProcessArrayColumn < this.fireProcessArraySize.width; fireProcessArrayColumn++) {
        const fireProcessArrayIndex = fireProcessArrayColumn + (this.fireProcessArraySize.width * fireProcessArrayRow)
        const canvasIndex = pixelDensity * fireProcessArrayColumn + (this.fireProcessArraySize.width * pixelDensity * pixelDensity * fireProcessArrayRow)
        const fireIntensity = this.fireProcessArray[fireProcessArrayIndex]
        const color = fireColorsPalette[fireIntensity]
        for (let pixelRow = 0; pixelRow < pixelDensity; pixelRow++) {
          for (let pixelColumn = 0; pixelColumn < pixelDensity; pixelColumn++) {
            const pixelIndex = pixelColumn + (this.fireProcessArraySize.width * pixelDensity * pixelRow)
            firePixelsRGBAArray[4 * (canvasIndex + pixelIndex)] = color.r // R
            firePixelsRGBAArray[4 * (canvasIndex + pixelIndex) + 1] = color.g // G
            firePixelsRGBAArray[4 * (canvasIndex + pixelIndex) + 2] = color.b // B
            firePixelsRGBAArray[4 * (canvasIndex + pixelIndex) + 3] = Math.pow(fireIntensity, 2) // A
          }
        }
      }
    }
  }
}
