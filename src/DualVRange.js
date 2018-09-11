import DualRange from './DualRange';
import def from './definitions';

export default class DualVRange extends DualRange {
    constructor(htmlElement) {
        super(htmlElement);
        [
            this.backgroundDiv,
            this.firstSliderContainer, this.firstSlider,
            this.rangeSliderContainer, this.rangeSlider,
            this.lastSliderContainer, this.lastSlider
        ].forEach((div) => div.classList.add(def.verticalClass));
        super.createInHrangeElements();
        super.updatePositions();
    }
    _updateVerticalPosition(val, container) {
        let offsetTop = this.dualRangeElement.offsetTop;
        let offsetLeft = this.dualRangeElement.offsetLeft;
        let eleWidth = this.dualRangeElement.clientWidth;
        let eleHeight = this.dualRangeElement.clientHeight;
        let percentage = val;

        let top = offsetTop + percentage * eleHeight - this.firstSliderContainer.clientHeight/2;
        let left = offsetLeft;
        container.style.top = `${top - window.scrollY}px`;
        container.style.left = `${left - window.scrollX}px`;
        container.style.width = `${eleWidth}px`;
    }
    // override
    updateFirstPosition(val) { this._updateVerticalPosition(val, this.firstSliderContainer); }
    // override
    updateLastPosition(val) { this._updateVerticalPosition(val, this.lastSliderContainer); }
    // override
    updateRange(val1, val2) {
        if(typeof val1 === 'number' && !isNaN(val1)) {
            let oldTop = this.rangeSliderContainer.offsetTop;
            let oldHeight = this.rangeSliderContainer.clientHeight;
            let oldBottom = oldTop + oldHeight;
            let percentage = val1;
            let newTop = this.dualRangeElement.offsetTop - window.scrollY
                + percentage * this.dualRangeElement.clientHeight;
            let newHeight = oldBottom - newTop;
            this.rangeSliderContainer.style.top = `${newTop}px`;
            this.rangeSliderContainer.style.height = `${newHeight}px`;
        }

        if(typeof val2 === 'number' && !isNaN(val2)) {
            let oldTop = this.rangeSliderContainer.offsetTop;
            let percentage = val2;
            let newBottom = this.dualRangeElement.offsetTop
                + percentage * this.dualRangeElement.clientHeight;
            let newHeight = newBottom - oldTop;
            this.rangeSliderContainer.style.height = `${newHeight - window.scrollY}px`;
        }

        this.rangeSliderContainer.style.left = `${this.dualRangeElement.offsetLeft - window.scrollX}px`;
        this.rangeSliderContainer.style.width = `${this.dualRangeElement.clientWidth}px`;
    }
    getMouseValue(event) {
        let clientY = event.touches ? event.touches.item(0).clientY : event.clientY;
        let relativeY = clientY - this.dualRangeElement.offsetTop + window.scrollY;
        let percentage = relativeY / this.dualRangeElement.clientHeight;
        return percentage;
    }

    // override
    static getObject(id) {
        if(typeof DualRange.dict[id] !== 'undefined') {
            return DualRange.dict[id];
        } else return DualVRange(id);
    }
}
