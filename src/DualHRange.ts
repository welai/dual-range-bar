import DualRange from './DualRange';

export default class DualHRange extends DualRange {
  update() {
    const barW = this.doms.background.clientWidth
    const barH = this.doms.background.clientHeight
    const startSliderW = this.doms.startSlider.clientWidth
    const startSliderH = this.doms.startSlider.clientHeight
    const endSliderW = this.doms.endSlider.clientWidth
    const endSliderH = this.doms.endSlider.clientHeight
    const rangeSliderW = (this.relative.upper - this.relative.lower) * barW
    const rangeSliderH = this.doms.rangeSlider.clientHeight

    const startSliderL = this.relative.lower * barW - startSliderW/2
    const startSliderT = barH/2 - startSliderH/2
    const endSliderL = this.relative.upper * barW - endSliderW/2
    const endSliderT = barH/2 - endSliderH/2
    const rangeSliderL = this.relative.lower * barW
    const rangeSliderT = barH/2 - rangeSliderH/2

    this.doms.startSlider.style.left = `${startSliderL}px`
    this.doms.startSlider.style.top = `${startSliderT}px`
    this.doms.endSlider.style.left = `${endSliderL}px`
    this.doms.endSlider.style.top = `${endSliderT}px`
    this.doms.rangeSlider.style.left = `${rangeSliderL}px`
    this.doms.rangeSlider.style.top = `${rangeSliderT}px`
    this.doms.rangeSlider.style.width = `${rangeSliderW}px`
  }

  /** Helper function for getting dx via clientX */
  private getDx(clientX: number) {
    const bgRect = this.doms.background.getBoundingClientRect()
    return clientX - bgRect.left
  }

  draggingStart(event: MouseEvent) {
    const minLower = 0, maxLower = 1 - this.relative.minSpan
    let newLower = this.getDx(event.clientX)/this.doms.background.clientWidth
    if (newLower < minLower) newLower = minLower
    if (newLower > maxLower) newLower = maxLower
    this.relative.lower = newLower
    if (newLower + this.relative.minSpan > this.relative.upper)
      this.relative.upper = newLower + this.relative.minSpan
  }
  
  draggingEnd(event: MouseEvent) {
    const minUpper = this.relative.minSpan, maxUpper = 1
    let newUpper = this.getDx(event.clientX)/this.doms.background.clientWidth
    if (newUpper < minUpper) newUpper = minUpper
    if (newUpper > maxUpper) newUpper = maxUpper
    this.relative.upper = newUpper
    if (newUpper - this.relative.minSpan < this.relative.lower)
      this.relative.lower = newUpper - this.relative.minSpan
  }

  draggingRange(event: MouseEvent) {
    const maxDx = 1 - this.relative.upper, minDx = -this.relative.lower
    let dx = event.movementX/this.doms.background.clientWidth
    if (dx > maxDx) dx = maxDx; if (dx < minDx) dx = minDx
    this.relative.lower += dx; this.relative.upper += dx
  }

  constructor(container: string | HTMLDivElement) {
    super(container);
    this.container.classList.add(`${this.prefix}-horizontal`)
    // Inline styles
    this.doms.background.style.width = '100%'
    this.update()
  }
}