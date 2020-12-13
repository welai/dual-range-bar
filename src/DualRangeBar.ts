/** Common logic for a dual range bar object
 * @author Celestial Phineas */
import './style.css'
import { setStyle } from './utils'
import ResizeObserver from 'resize-observer-polyfill'

export type Config = {
  /** Minimizes the container when inactive */
  minimizes?: boolean,
  /** Size of the dual range bar */
  size?: 'small' | 'default' | 'large' | 'huge',
  /** Minimum possible value of the ranges, 
   * value that the left-most stands for. 0 by default. */
  lowerBound?: number,
  /** Maximum possible value of the ranges,
   * value that the right-most stands for. 1 by default. */
  upperBound?: number,
  /** Minimum span of possible ranges. 0.2 by default. */
  minSpan?: number,
  /** Maximum span of possible ranges. 1 by default. */
  maxSpan?: number,
  /** Current lower value of the range. */
  lower?: number,
  /** Current upper value of the range. */
  upper?: number,
  /** Color of the sliders */
  sliderColor?: string,
  /** Color of active sliders */
  sliderActiveColor?: string,
  /** Color of the range slider */
  rangeColor?: string,
  /** Color of active range slider */
  rangeActiveColor?: string,
  /** Color of the background */
  bgColor?: string
}

export default abstract class DualRangeBar implements EventTarget {
  /** Container element */
  container: HTMLDivElement
  /** Constructed elements */
  doms = {
    /** Backgroud div */
    background:   document.createElement('div'),
    /** Div of the starting slider */
    startSlider:  document.createElement('div'),
    /** Div of the ending slider */
    endSlider:    document.createElement('div'),
    /** Div of the range slider */
    rangeSlider:  document.createElement('div')
  }

  emitEvent() {
    const event = new CustomEvent('update', {
      detail: this
    })
    this.container.dispatchEvent(event)
  }

  /** A unique prefix for everything in dual-range-bar */
  readonly prefix = 'drbar'
  /** An helper function for generating a unique ID */
  private getUniqueID() {
    return `${this.prefix}-${Math.random().toString(36).substr(2, 9)}`
  }

  /** Update element locations */
  update() {
    // Update data attributes
    this.container.dataset.lowerBound = this.lowerBound.toString()
    this.container.dataset.upperBound = this.upperBound.toString()
    this.container.dataset.minSpan = this.minSpan.toString()
    this.container.dataset.maxSpan = this.maxSpan.toString()
    this.container.dataset.lower = this.lower.toString()
    this.container.dataset.upper = this.upper.toString()
  }
  /** The slider that is under dragging */
  protected underDragging: 'start' | 'end' | 'range' | null = null
  /** This function is called when the starting slider is under dragging.
   * It should handle the updating of relative values.
   * `update` function does not need to be manually called */
  protected abstract draggingStart(event: MouseEvent | TouchEvent): void
  /** This function is called when the ending slider is under dragging
   * It should handle the updating of relative values.
   * `update` function does not need to be manually called */
  protected abstract draggingEnd(event: MouseEvent | TouchEvent): void
   /** This function is called when the range slider is under dragging
   * It should handle the updating of relative values.
   * `update` function does not need to be manually called */
  protected abstract draggingRange(event: MouseEvent | TouchEvent): void
  /** Wheel behavior on the range slider */
  protected abstract wheelScaling(event: WheelEvent): void
  /** Wheel behavior on the background */
  protected abstract wheelScrolling(event: WheelEvent): void

  /** Relative values are used for calculating layout,
   * this should range from 0 to 1. */
  protected relative = {
    /** Corresponding value of the starting slider */
    lower: 0,
    /** Corresponding value of the ending slider */
    upper: 1,
    /** Minimum span of the range slider, in ratio to 1 */
    minSpan: 0.2,
    /** Maximum span of the range slider, in ratio to 1 */
    maxSpan: 1,
  }

  //#region Absolute preperties
  /** Minimum possible value of the ranges */
  lowerBound = 0
  /** Maximum possible value of the ranges */
  upperBound = 1
  /** Difference of the upper bound and the lower bound */
  get boundSpan() { return this.upperBound - this.lowerBound }
  /** Absolute lower range */
  get lower() { return this.relative.lower * this.boundSpan + this.lowerBound }
  set lower(newVal) {
    if (this.boundSpan === 0)
      throw Error('"lowerBound" should not equal to "upperBound"')
    const relativeLower = (newVal - this.lowerBound) / this.boundSpan
    if (relativeLower < 0 || relativeLower > 1)
      throw Error('"lower" value out of bound')
    this.relative.lower = relativeLower
    this.update()
  }
  /** Absolute upper range */
  get upper() { return this.relative.upper * this.boundSpan + this.lowerBound }
  set upper(newVal) {
    if (this.boundSpan === 0)
      throw Error('"lowerBound" should not equal to "upperBound"')
    const relativeUpper = (newVal - this.lowerBound) / this.boundSpan
    if (relativeUpper < 0 || relativeUpper > 1)
      throw Error('"upper" value out of bound')
    this.relative.upper = relativeUpper
    this.update()
  }
  /** Absolute minimum range span */
  get minSpan() { return this.relative.minSpan * this.boundSpan }
  set minSpan(newVal) {
    if (this.boundSpan === 0)
      throw Error('"lowerBound" should not equal to "upperBound"')
    const relativeSpan = Math.abs(newVal / this.boundSpan)
    if (relativeSpan > 1) throw Error('Invalid "minSpan" specification')
    this.relative.minSpan = relativeSpan
    this.update()
  }
  /** Absolute maximum range span */
  get maxSpan() { return this.relative.maxSpan * this.boundSpan }
  set maxSpan(newVal) {
    if (this.boundSpan === 0)
      throw Error('"lowerBound" should not equal to "upperBound"')
    const relativeSpan = Math.abs(newVal / this.boundSpan)
    if (relativeSpan > 1) throw Error('Invalid "maxSpan" specification')
    this.relative.maxSpan = relativeSpan
    this.update()
  }
  //#endregion

  /** Saved touchstart clientX */ protected prevClientX = 0
  /** Saved touchstart clientY */ protected prevClientY = 0
  /** Handling events */
  private handleEvents() {
    // Update bar when the container resizes
    const resizeObserver = new ResizeObserver(() => {
      this.update()
    })
    resizeObserver.observe(this.container)
    // `underDragging` status update
    const saveClientXY = (e: TouchEvent) => {
      this.prevClientX = e.touches.item(0)?.clientX || 0
      this.prevClientY = e.touches.item(0)?.clientY || 0
    }
    this.doms.startSlider.addEventListener('mousedown', () => {
      this.underDragging = 'start' })
    this.doms.startSlider.addEventListener('touchstart', (e) => {
      saveClientXY(e)
      this.underDragging = 'start' })
    this.doms.endSlider.addEventListener('mousedown', () => {
      this.underDragging = 'end' })
    this.doms.endSlider.addEventListener('touchstart', (e) => {
      saveClientXY(e)
      this.underDragging = 'end' })
    this.doms.rangeSlider.addEventListener('mousedown', () => {
      this.underDragging = 'range' })
    this.doms.rangeSlider.addEventListener('touchstart', (e) => {
      saveClientXY(e)
      this.underDragging = 'range' })
    // Moving pointer
    const pointerMove = (e: MouseEvent | TouchEvent) => {
      if(this.underDragging !== null) e.preventDefault()
      switch (this.underDragging) {
        case null: return
        case 'start': this.draggingStart(e); break
        case 'end': this.draggingEnd(e); break
        case 'range': this.draggingRange(e); break
      }
      this.update()
      this.emitEvent()
    }
    window.addEventListener('mousemove', pointerMove)
    window.addEventListener('touchmove', pointerMove)
    // Pointer up
    const pointerUp = () => {
      if (this.underDragging === null) return
      this.underDragging = null
      this.update()
      this.emitEvent()
    }
    window.addEventListener('mouseup', pointerUp)
    window.addEventListener('touchend', pointerUp)
    window.addEventListener('touchcancel', pointerUp)
    // Wheel behaviour
    this.doms.rangeSlider.addEventListener('wheel', (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.wheelScaling(e)
      this.update()
      this.emitEvent()
    })
    this.doms.background.addEventListener('wheel', (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.wheelScrolling(e)
      this.update()
      this.emitEvent()
    })
  }

  /** Dual range bar contructor
   * @constructor
   * @param {string | HTMLDivElement} container The container element of the dual range bar */
  protected constructor(container: string | HTMLDivElement, config?: Config) {
    //#region Initializing the container
    if (typeof(container) === 'string')
      this.container = document.getElementById(container) as HTMLDivElement
    else this.container = container
    // Throw an error if failed
    if (!this.container)
      throw Error(`${container} is not a <div> element.`)
    // Add an id to the container if the container does not have one
    if (this.container.id === null) this.container.id = this.getUniqueID();
    ((x: string) => { if (!this.container.classList.contains(x)) {
      this.container.classList.add(x)
    }})(`${this.prefix}-container`)
    //#endregion

    //#region DOM element initializing
    // Set class for the div elements
    this.doms.background.classList.add(`${this.prefix}-bg`)
    this.doms.startSlider.classList.add(`${this.prefix}-slider`, `${this.prefix}-start`)
    this.doms.endSlider.classList.add(`${this.prefix}-slider`, `${this.prefix}-end`)
    this.doms.rangeSlider.classList.add(`${this.prefix}-range`)
    
    // Insert the DOMs
    this.container.appendChild(this.doms.background)
    this.doms.background.appendChild(this.doms.rangeSlider)
    this.doms.background.appendChild(this.doms.startSlider)
    this.doms.background.appendChild(this.doms.endSlider)
    //#endregion

    //#region Inline styles of the DOM elements
    setStyle(this.container, {
      display: 'flex', overflow: 'visible', 
      alignItems: 'center', justifyContent: 'center'
    })
    const elementStyle = {
      display: 'block', overflow: 'visible', position: 'absolute'
    }
    setStyle(this.doms.background, elementStyle)
    setStyle(this.doms.startSlider, elementStyle)
    setStyle(this.doms.endSlider, elementStyle)
    setStyle(this.doms.rangeSlider, elementStyle)
    //#endregion

    //#region Handling configuration
    if (config?.minimizes)
      this.container.classList.add(`${this.prefix}-minimizes`)
    // Size configuration
    if (config?.size) {
      this.container.classList.remove(`${this.prefix}-small`, 
        `${this.prefix}-large`, `${this.prefix}-huge`)
      if (config.size !== 'default')
        this.container.classList.add(`${this.prefix}-${config.size}`)
    }
    // Declarative data attributes
    if (this.container.dataset.lowerBound !== undefined)
      this.lowerBound = parseFloat(this.container.dataset.lowerBound)
    if (this.container.dataset.upperBound !== undefined)
      this.upperBound = parseFloat(this.container.dataset.upperBound)
    if (this.container.dataset.minSpan !== undefined)
      this.minSpan = parseFloat(this.container.dataset.minSpan)
    if (this.container.dataset.maxSpan !== undefined)
      this.maxSpan = parseFloat(this.container.dataset.maxSpan)
    if (this.container.dataset.lower !== undefined)
      this.lower = parseFloat(this.container.dataset.lower)
    if (this.container.dataset.upper !== undefined)
      this.upper = parseFloat(this.container.dataset.upper)
    // Values in the config
    if (config?.lowerBound !== undefined) this.lowerBound = config.lowerBound
    if (config?.upperBound !== undefined) this.upperBound = config.upperBound
    if (config?.minSpan !== undefined) this.minSpan = config.minSpan
    if (config?.maxSpan !== undefined) this.maxSpan = config.maxSpan
    if (config?.lower !== undefined) this.lower = config.lower
    if (config?.upper !== undefined) this.upper = config.upper
    // Handling color config
    const colorConfig: { [ key: string ]: string } = {}
    if (config?.sliderColor)
      colorConfig['--slider-color'] = config.sliderColor
    if (config?.sliderActiveColor)
      colorConfig['--slider-active'] = config.sliderActiveColor
    if (config?.rangeColor)
      colorConfig['--range-color'] = config.rangeColor
    if (config?.rangeActiveColor)
      colorConfig['--range-active'] = config.rangeActiveColor
    if (config?.bgColor)
      colorConfig['--bg-color'] = config.bgColor
    if (Object.keys(colorConfig).length > 0) {
      let cssString = `#${this.container.id}{`
      for (const key in colorConfig) cssString += `${key}:${colorConfig[key]};`
      cssString += '}'
      const sheet = document.createElement('style')
      sheet.innerText = cssString
      document.head.appendChild(sheet)
    }
    //#endregion

    this.handleEvents()
  }

  // Implementing the EventTarget interface
  addEventListener(type: string, listener: EventListener | EventListenerObject | null, options?: boolean | AddEventListenerOptions) {
    this.container.addEventListener(type as any, listener as any, options)
  }
  dispatchEvent(event: Event): boolean {
    return this.container.dispatchEvent(event)
  }
  removeEventListener(type: string, callback: EventListener | EventListenerObject | null, options?: boolean | EventListenerOptions) {
    this.container.removeEventListener(type as any, callback as any, options)
  }
}