import { getDeltaY } from './utils'
import DualRangeBar from './DualRangeBar'
import { Config } from './DualRangeBar'

export default class DualVRangeBar extends DualRangeBar {
  update() {
    super.update()
    const barW = this.doms.background.clientWidth
    const barH = this.doms.background.clientHeight
    const startSliderW = this.doms.startSlider.clientWidth
    const startSliderH = this.doms.startSlider.clientHeight
    const endSliderW = this.doms.endSlider.clientWidth
    const endSliderH = this.doms.endSlider.clientHeight
    const rangeSliderW = this.doms.rangeSlider.clientWidth
    const rangeSliderH = (this.relative.upper - this.relative.lower) * barH

    const startSliderL = barW/2 - startSliderW/2
    const startSliderT = this.relative.lower * barH - startSliderH/2
    const endSliderL = barW/2 - endSliderW/2
    const endSliderT = this.relative.upper * barH - endSliderH/2
    const rangeSliderL = barW/2 - rangeSliderW/2
    const rangeSliderT = this.relative.lower * barH

    this.doms.startSlider.style.left = `${startSliderL}px`
    this.doms.startSlider.style.top = `${startSliderT}px`
    this.doms.endSlider.style.left = `${endSliderL}px`
    this.doms.endSlider.style.top = `${endSliderT}px`
    this.doms.rangeSlider.style.left = `${rangeSliderL}px`
    this.doms.rangeSlider.style.top = `${rangeSliderT}px`
    this.doms.rangeSlider.style.height = `${rangeSliderH}px`
  }

  /** Helper function for getting dx via clientX */
  private getDy(clientY: number) {
    const bgRect = this.doms.background.getBoundingClientRect()
    return clientY - bgRect.top
  }

  protected draggingStart(event: MouseEvent) {
    const minLower = 0, maxLower = 1 - this.relative.minSpan
    let newLower = this.getDy(event.clientY)/this.doms.background.clientHeight
    if (newLower < minLower) newLower = minLower
    if (newLower > maxLower) newLower = maxLower
    this.relative.lower = newLower
    if (newLower + this.relative.minSpan > this.relative.upper)
      this.relative.upper = newLower + this.relative.minSpan
    if (newLower + this.relative.maxSpan < this.relative.upper)
      this.relative.upper = newLower + this.relative.maxSpan
  }
  
  protected draggingEnd(event: MouseEvent) {
    const minUpper = this.relative.minSpan, maxUpper = 1
    let newUpper = this.getDy(event.clientY)/this.doms.background.clientHeight
    if (newUpper < minUpper) newUpper = minUpper
    if (newUpper > maxUpper) newUpper = maxUpper
    this.relative.upper = newUpper
    if (newUpper - this.relative.minSpan < this.relative.lower)
      this.relative.lower = newUpper - this.relative.minSpan
    if (newUpper - this.relative.maxSpan > this.relative.lower)
      this.relative.lower = newUpper - this.relative.maxSpan
  }

  protected draggingRange(event: MouseEvent) {
    const maxDx = 1 - this.relative.upper, minDx = -this.relative.lower
    let dx = event.movementY/this.doms.background.clientHeight
    if (dx > maxDx) dx = maxDx; if (dx < minDx) dx = minDx
    this.relative.lower += dx; this.relative.upper += dx
  }

  protected wheelScaling(event: WheelEvent) {
    const dy = getDeltaY(event)/this.doms.background.clientHeight
    const cursorPos = this.getDy(event.clientY)/this.doms.background.clientHeight
    const relativeSpan = this.relative.upper - this.relative.lower
    let newLower = this.relative.lower - 
      dy * (cursorPos-this.relative.lower) / relativeSpan
    let newUpper = this.relative.upper + 
      dy * (this.relative.upper-cursorPos) / relativeSpan
    if (newLower < 0) newLower = 0
    if (newUpper > 1) newUpper = 1
    if (newUpper - newLower < this.relative.minSpan) {
      newLower = cursorPos - 
        this.relative.minSpan * (cursorPos-this.relative.lower) / relativeSpan
      newUpper = cursorPos + 
        this.relative.minSpan * (this.relative.upper-cursorPos) / relativeSpan
    }
    if (newUpper - newLower > this.relative.maxSpan) {
      newLower = cursorPos -
        this.relative.maxSpan * (cursorPos-this.relative.lower) / relativeSpan
      newUpper = cursorPos +
        this.relative.maxSpan * (this.relative.upper-cursorPos) / relativeSpan
    }
    this.relative.lower = newLower
    this.relative.upper = newUpper
  }

  protected wheelScrolling(event: WheelEvent) {
    let dy = getDeltaY(event)/this.doms.background.clientHeight
    const minDy = -this.relative.lower
    const maxDy = 1 - this.relative.upper
    if (dy < minDy) dy = minDy
    if (dy > maxDy) dy = maxDy
    this.relative.lower += dy
    this.relative.upper += dy
  }

  constructor(container: string | HTMLDivElement, config?: Config) {
    super(container, config);
    this.container.classList.add(`${this.prefix}-vertical`)
    // Inline styles
    this.doms.background.style.height = '100%'
    this.update()
  }
}