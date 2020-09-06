import { fireColorsPalette } from './fire-animation-colors-palette'
import { AnimationSize } from '../../protocols/animation'

export class FireAnimationProcess {
  constructor (
    fireProcessArraySize: AnimationSize,
    debug: boolean = false,
    updateScreenRate: number = 40
  ) {
    if (fireProcessArraySize.width % 2) {
      fireProcessArraySize.width++
    }
    this.fireProcessArraySize = fireProcessArraySize
    this.screenLength = fireProcessArraySize.width * fireProcessArraySize.height
    this.debug = debug
    this.updateScreenRate = updateScreenRate
  }

  fireProcessArray: number[] = []
  fireProcessArraySize: AnimationSize
  screenLength: number
  debug: boolean
  updateScreenRate: number

  build = (firePixelsRGBAArray: number[], pixelDensity: number = 1): void => {
    this.createFireDataStructure()
    this.createFireSource()
    this.renderRGBAFire(firePixelsRGBAArray, pixelDensity)

    // setInterval(this.calculeteFirePropagation, this.updateScreenRate)
  }

  createFireDataStructure = (): void => {
    for (let i = 0; i < this.screenLength; i++) {
      this.fireProcessArray[i] = 0
    }
  }

  createFireSource = (sourceLength: number = this.fireProcessArraySize.width): void => {
    const startSource = Math.trunc(this.fireProcessArraySize.width / 2) - Math.trunc(sourceLength / 2)
    const endSource = Math.ceil(this.fireProcessArraySize.width / 2) + Math.ceil(sourceLength / 2)
    for (let column = startSource; column < endSource; column++) {
      const overflowFireCellIndex = this.fireProcessArraySize.width * this.fireProcessArraySize.height
      const fireCellIndex = (overflowFireCellIndex - this.fireProcessArraySize.width) + column
      this.fireProcessArray[fireCellIndex] = 36
    }
    console.log(this.fireProcessArray)
  }

  calculeteFirePropagation = (): void => {
    for (let column = 0; column < this.fireProcessArraySize.width; column++) {
      for (let row = 0; row < this.fireProcessArraySize.height; row++) {
        const currentFireCellIndex = column + (this.fireProcessArraySize.width * row)
        this.updateFireIntensityPerFireCell(currentFireCellIndex)
      }
    }
  }

  updateFireIntensityPerFireCell = (currentFireCellIndex: number): void => {
    const belowFireCellIndex = currentFireCellIndex + this.fireProcessArraySize.width
    if (belowFireCellIndex >= this.fireProcessArraySize.width * this.fireProcessArraySize.height) {
      return
    }

    const decay = Math.floor(Math.random() * 3)
    const belowFireCellIntensity = this.fireProcessArray[belowFireCellIndex]
    const newFireIntensity = belowFireCellIntensity - decay >= 0 ? belowFireCellIntensity - decay : 0

    this.fireProcessArray[currentFireCellIndex - decay] = newFireIntensity
  }

  renderRGBAFire = (firePixelsRGBAArray: number[], pixelDensity: number = 1): void => {
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
