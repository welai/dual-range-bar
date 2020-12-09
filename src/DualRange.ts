/** Common logic for a dual range bar object
 * @author Celestial Phineas */
import './style.css'
import { setStyle } from './utils'
import ResizeObserver from 'resize-observer-polyfill'

export default abstract class DualRange implements EventTarget {
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

  /** A unique prefix for everything in dual-range-bar */
  readonly prefix = 'drbar'
  /** An helper function for generating a unique ID */
  private getUniqueID() {
    return `${this.prefix}-${Math.random().toString(36).substr(2, 9)}`
  }

  /** Update element locations */
  abstract update(): void
  /** This function is called when the starting slider is under dragging.
   * It should handle the updating of relative values.
   * `update` function does not need to be manually called */
  abstract draggingStart(event: MouseEvent): void
  /** This function is called when the ending slider is under dragging
   * `update` function does not need to be manually called */
  abstract draggingEnd(event: MouseEvent): void
  /** This function is called when the range slider is under dragging
   * `update` function does not need to be manually called */
  abstract draggingRange(event: MouseEvent): void
  /** The slider that is under dragging */
  protected underDragging: 'start' | 'end' | 'range' | null = null

  /** Relative values are used for calculating layout,
   * this should range from 0 to 1. */
  protected relative = {
    /** Corresponding value of the starting slider */
    lower: 0,
    /** Corresponding value of the ending slider */
    upper: 1,
    /** Minimum span of the range slider, in ratio to 1 */
    minSpan: 0.1
  }

  //#region Absolute preperties
  /** Minimum possible value of the ranges */
  lowerBound = 0
  /** Maximum possible value of the ranges */
  upperBound = 1
  /** Difference of the upper bound and the lower bound */
  get boundSpan() { return this.upperBound - this.lowerBound }
  /** Absolute lower range */
  get lower() { return this.relative.lower * this.boundSpan }
  set lower(newVal) {
    if (this.boundSpan === 0)
      throw Error('"lowerBound" should not equal to "upperBound"')
    this.relative.lower = newVal / this.boundSpan
    this.update()
  }
  /** Absolute upper range */
  get upper() { return this.relative.upper * this.boundSpan }
  set upper(newVal) {
    if (this.boundSpan === 0)
      throw Error('"lowerBound" should not equal to "upperBound"')
    this.relative.upper = newVal / this.boundSpan
    this.update()
  }
  /** Absolute minimum range span */
  get minSpan() { return this.relative.minSpan * this.boundSpan }
  set minSpan(newVal) {
    if (this.boundSpan === 0)
      throw Error('"lowerBound" should not equal to "upperBound"')
    const relativeSpan = newVal / this.boundSpan
    if (relativeSpan > 1 || relativeSpan < 0)
      throw Error('Invalid "minSpan" specification')
    this.relative.minSpan = relativeSpan
    this.update()
  }
  //#endregion

  /** Dual range bar contructor
   * @constructor
   * @param {string | HTMLDivElement} container The container element of the dual range bar */
  protected constructor(container: string | HTMLDivElement) {
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

    // Inline styles of the DOM elements
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

    // Update bar when the container resizes
    const resizeObserver = new ResizeObserver(() => {
      this.update()
    })
    resizeObserver.observe(this.container)
    // `underDragging` status update
    this.doms.startSlider.addEventListener('mousedown', () => {
      this.underDragging = 'start' })
    this.doms.endSlider.addEventListener('mousedown', () => {
      this.underDragging = 'end' })
    this.doms.rangeSlider.addEventListener('mousedown', () => {
      this.underDragging = 'range' })
    window.addEventListener('mousemove', (e) => {
      switch (this.underDragging) {
        case null: return
        case 'start': this.draggingStart(e); break
        case 'end': this.draggingEnd(e); break
        case 'range': this.draggingRange(e); break
      }
      this.update()
    })
    window.addEventListener('mouseup', () => {
      if (this.underDragging === null) return
      this.underDragging = null; this.update(); return
    })
  }

  addEventListener(type: string, listener: EventListener | EventListenerObject | null, options?: boolean | AddEventListenerOptions): void {
    throw new Error("Method not implemented.")
  }
  dispatchEvent(event: Event): boolean {
    throw new Error("Method not implemented.")
  }
  removeEventListener(type: string, callback: EventListener | EventListenerObject | null, options?: boolean | EventListenerOptions): void {
    throw new Error("Method not implemented.")
  }
}