import p5 from 'p5'
import { Animation, AnimationSize } from '@/presentation/p5/protocols/animation'
import 'p5/lib/addons/p5.sound' // HACK: add import p5 from 'p5' on top of file p5.sound.js
import { noteTable, noteTableMajor, noteTableSus1, noteTableSus2, keysTable } from '.'

type EnvelopeSlider = {
  A: p5.Element
  D: p5.Element
  S: p5.Element
  R: p5.Element
  attackLevel: p5.Element
  releaseLevel: p5.Element
  width: number
  xPos: number
  yPos: number
  pitchPos: number
}

type DelaySlider = {
  time: p5.Element
  feedback: p5.Element
  cutoff: p5.Element
  width: number
  xPos: number
  yPos: number
  pitchPos: number
}

export class Synthesizer implements Animation {
  constructor (
    readonly animationSize: AnimationSize,
    readonly frameRate: number = 30,
    readonly freqResolutionRatio: number = 4
  ) {

  }

  canvas: p5.Renderer
  myP5: p5
  envelopeSlider: EnvelopeSlider
  envelope: p5.Envelope
  delaySlider: DelaySlider
  delay: p5.Delay
  osc: p5.SawOsc
  fft: p5.FFT
  keyboardMode: boolean = true
  keyboardModeCheckbox: any

  sketch = (p: p5): void => {
    p.setup = () => {
      this.canvas = p.createCanvas(this.animationSize.width, this.animationSize.height)
      p.frameRate(this.frameRate)

      this.keyboardModeCheckbox = p.createCheckbox('Keyboad Mode', this.keyboardMode)
      this.keyboardModeCheckbox.position(400, 10)
      this.keyboardModeCheckbox.style('color', '#FFFFFF')
      // -------------------------------------------------------------------
      // Oscillator
      this.osc = new p5.SawOsc() // set frequency and type

      // -------------------------------------------------------------------
      // Envelope
      this.envelope = new p5.Envelope()
      const envelopeSlider: EnvelopeSlider = {
        A: p.createSlider(0, 1, 0.01, 0),
        D: p.createSlider(0, 1, 0.2, 0),
        S: p.createSlider(0, 1, 0.2, 0),
        R: p.createSlider(0, 1, 0.5, 0),
        attackLevel: p.createSlider(0, 1, 1, 0),
        releaseLevel: p.createSlider(0, 1, 0, 0),
        width: 200,
        xPos: 10,
        yPos: 10,
        pitchPos: 30
      }
      this.envelopeSlider = envelopeSlider
      this.envelopeSlider.A.position(this.envelopeSlider.xPos, this.envelopeSlider.yPos)
      this.envelopeSlider.A.style('width', `${this.envelopeSlider.width}px`)

      this.envelopeSlider.D.position(this.envelopeSlider.xPos, this.envelopeSlider.yPos + this.envelopeSlider.pitchPos)
      this.envelopeSlider.D.style('width', `${this.envelopeSlider.width}px`)

      this.envelopeSlider.S.position(this.envelopeSlider.xPos, this.envelopeSlider.yPos + (2 * this.envelopeSlider.pitchPos))
      this.envelopeSlider.S.style('width', `${this.envelopeSlider.width}px`)

      this.envelopeSlider.R.position(this.envelopeSlider.xPos, this.envelopeSlider.yPos + (3 * this.envelopeSlider.pitchPos))
      this.envelopeSlider.R.style('width', `${this.envelopeSlider.width}px`)

      this.envelopeSlider.attackLevel.position(this.envelopeSlider.xPos, this.envelopeSlider.yPos + (4 * this.envelopeSlider.pitchPos))
      this.envelopeSlider.attackLevel.style('width', `${this.envelopeSlider.width}px`)

      this.envelopeSlider.releaseLevel.position(this.envelopeSlider.xPos, this.envelopeSlider.yPos + (5 * this.envelopeSlider.pitchPos))
      this.envelopeSlider.releaseLevel.style('width', `${this.envelopeSlider.width}px`)

      // -------------------------------------------------------------------
      // Delay
      this.delay = new p5.Delay()
      const delaySlider: DelaySlider = {
        time: p.createSlider(0, 1, 1, 0),
        feedback: p.createSlider(0, 0.99, 0, 0),
        cutoff: p.createSlider(0, 2300, 1150, 0),
        width: 200,
        xPos: 10,
        yPos: 210,
        pitchPos: 30
      }
      this.delaySlider = delaySlider
      this.delaySlider.time.position(this.delaySlider.xPos, this.delaySlider.yPos)
      this.delaySlider.time.style('width', `${this.delaySlider.width}px`)
      this.delaySlider.feedback.position(this.delaySlider.xPos, this.delaySlider.yPos + this.delaySlider.pitchPos)
      this.delaySlider.feedback.style('width', `${this.delaySlider.width}px`)
      this.delaySlider.cutoff.position(this.delaySlider.xPos, this.delaySlider.yPos + (2 * this.delaySlider.pitchPos))
      this.delaySlider.cutoff.style('width', `${this.delaySlider.width}px`)
      this.delay.process(this.osc, 0.12, 0.7, 2300)

      // -------------------------------------------------------------------
      this.fft = new p5.FFT()

      this.canvas.mousePressed(this.playEnvelope)

      this.osc.amp(this.envelope)
      this.osc.start()
    }

    p.draw = () => {
      p.background(100, 100, 100)
      if (!this.keyboardModeCheckbox.checked()) {
        this.osc.freq(p.map(p.mouseX / this.freqResolutionRatio, 0, p.width, 40, 880))
      }

      // -------------------------------------------------------------------
      // FFT
      const spectrum = this.fft.analyze()
      p.noStroke()
      p.fill(0, 255, 0) // spectrum is green
      for (let i = 0; i < spectrum.length; i++) {
        const xFFT = p.map(i, 0, spectrum.length, 0, p.width)
        const hFFT = p.map(spectrum[i], 0, 255, p.height, 0) - p.height
        p.rect(xFFT, p.height, p.width / spectrum.length, hFFT)
      }

      // -------------------------------------------------------------------
      // Notes
      if (!this.keyboardModeCheckbox.checked()) {
        // p.noStroke()
        // p.fill(255, 255, 0)
        // p.textSize(14)
        // for (const i in noteTable) {
        //   p.rect(5 * Math.ceil(noteTable[i].freq) + 64, 0, 1, p.height)
        //   p.text(noteTable[i].name, 5 * Math.ceil(noteTable[i].freq) + 66, 20)
        // }
        p.fill(255, 255, 255)
        p.textSize(30)
        p.text('Click aqui com o mouse para tocar', 600, 100)
      } else {
        p.noStroke()
        p.fill(255, 255, 0)
        p.textSize(14)
        let index = 0
        for (const i in noteTableMajor) {
          p.fill(255, 255, 0)
          p.rect(500 + 50 * index, 100, 48, 48)
          p.fill(0, 0, 0)
          p.text(`${noteTableMajor[i].name}: ${noteTableMajor[i].key}`, 500 + 50 * index, 130)
          index++
        }
        p.fill(255, 255, 0)
        p.rect(500 + 50 * index, 100, 48, 48)
        p.fill(0, 0, 0)
        p.text(`${noteTableMajor.do.name}: K`, 500 + 50 * index, 130)
        index = 0
        for (const i in noteTableSus1) {
          p.fill(255, 255, 0)
          p.rect(525 + 50 * index, 50, 48, 48)
          p.fill(0, 0, 0)
          p.text(`${noteTableSus1[i].name}: ${noteTableSus1[i].key}`, 525 + 50 * index, 80)
          index++
        }
        index = 0
        for (const i in noteTableSus2) {
          p.fill(255, 255, 0)
          p.rect(675 + 50 * index, 50, 48, 48)
          p.fill(0, 0, 0)
          p.text(`${noteTableSus2[i].name}: ${noteTableSus2[i].key}`, 675 + 50 * index, 80)
          index++
        }
        p.fill(255, 255, 255)
        p.textSize(30)
        p.text('Use o teclado do computador para tocar', 500, 200)
      }
      // -------------------------------------------------------------------
      // Envelope
      p.textSize(16)
      p.fill(255, 255, 255)
      const envelopeAttackLevel: number = parseFloat(`${this.envelopeSlider.attackLevel.value()}`)
      p.text('Attack Level', this.envelopeSlider.xPos * 2 + this.envelopeSlider.width, this.envelopeSlider.yPos + 10)
      const envelopeReleaseLevel: number = parseFloat(`${this.envelopeSlider.releaseLevel.value()}`)
      p.text('Release Level', this.envelopeSlider.xPos * 2 + this.envelopeSlider.width, this.envelopeSlider.yPos + this.envelopeSlider.pitchPos + 10)
      this.envelope.setRange(envelopeAttackLevel, envelopeReleaseLevel)
      const envelopeAttackTime: number = parseFloat(`${this.envelopeSlider.A.value()}`)
      p.text('A', this.envelopeSlider.xPos * 2 + this.envelopeSlider.width, this.envelopeSlider.yPos + (2 * this.envelopeSlider.pitchPos) + 10)
      const envelopeDecayTime: number = parseFloat(`${this.envelopeSlider.D.value()}`)
      p.text('D', this.envelopeSlider.xPos * 2 + this.envelopeSlider.width, this.envelopeSlider.yPos + (3 * this.envelopeSlider.pitchPos) + 10)
      const envelopeSustainPercent: number = parseFloat(`${this.envelopeSlider.S.value()}`)
      p.text('S', this.envelopeSlider.xPos * 2 + this.envelopeSlider.width, this.envelopeSlider.yPos + (4 * this.envelopeSlider.pitchPos) + 10)
      const envelopeReleaseTime: number = parseFloat(`${this.envelopeSlider.R.value()}`)
      p.text('R', this.envelopeSlider.xPos * 2 + this.envelopeSlider.width, this.envelopeSlider.yPos + (5 * this.envelopeSlider.pitchPos) + 10)
      this.envelope.setADSR(envelopeAttackTime, envelopeDecayTime, envelopeSustainPercent, envelopeReleaseTime)

      // -------------------------------------------------------------------
      // Delay
      p.textSize(16)
      p.fill(255, 255, 255)
      const delayTime: number = parseFloat(`${this.delaySlider.time.value()}`)
      p.text('Delay Time', this.delaySlider.xPos * 2 + this.delaySlider.width, this.delaySlider.yPos + 10)
      this.delay.delayTime(delayTime)
      const delayFeedback: number = parseFloat(`${this.delaySlider.feedback.value()}`)
      p.text('Delay Feedback', this.delaySlider.xPos * 2 + this.delaySlider.width, this.delaySlider.yPos + this.delaySlider.pitchPos + 10)
      this.delay.feedback(delayFeedback)
      const delayCutoff: number = parseFloat(`${this.delaySlider.cutoff.value()}`)
      p.text('Delay Cutoff', this.delaySlider.xPos * 2 + this.delaySlider.width, this.delaySlider.yPos + (2 * this.delaySlider.pitchPos) + 10)
      this.delay.filter(delayCutoff, 0.5)
    }

    p.keyPressed = () => {
      switch (p.keyCode) {
        case keysTable.a:
          this.envelope.play(this.osc.freq(noteTable.do.freq))
          break
        case keysTable.w:
          this.envelope.play(this.osc.freq(noteTable.doSus.freq))
          break
        case keysTable.s:
          this.envelope.play(this.osc.freq(noteTable.re.freq))
          break
        case keysTable.e:
          this.envelope.play(this.osc.freq(noteTable.reSus.freq))
          break
        case keysTable.d:
          this.envelope.play(this.osc.freq(noteTable.mi.freq))
          break
        case keysTable.f:
          this.envelope.play(this.osc.freq(noteTable.fa.freq))
          break
        case keysTable.t:
          this.envelope.play(this.osc.freq(noteTable.faSus.freq))
          break
        case keysTable.g:
          this.envelope.play(this.osc.freq(noteTable.sol.freq))
          break
        case keysTable.y:
          this.envelope.play(this.osc.freq(noteTable.solSus.freq))
          break
        case keysTable.h:
          this.envelope.play(this.osc.freq(noteTable.la.freq))
          break
        case keysTable.u:
          this.envelope.play(this.osc.freq(noteTable.laSus.freq))
          break
        case keysTable.j:
          this.envelope.play(this.osc.freq(noteTable.si.freq))
          break
        case keysTable.k:
          this.envelope.play(this.osc.freq(2 * noteTable.do.freq))
          break
      }
    }
  }

  build = (currentRef: HTMLElement): void => {
    // eslint-disable-next-line new-cap
    this.myP5 = new p5(this.sketch, currentRef)
  }

  playEnvelope = (): void => {
    if (!this.keyboardModeCheckbox.checked()) {
      this.envelope.play(this.osc)
    }
  }
}
