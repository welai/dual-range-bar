import DualRange from './DualRange';
import def from './definitions';

export default class DualHRange extends DualRange {
    constructor(htmlElement) {
        super(htmlElement);
        [
            this.backgroundDiv,
            this.firstSliderContainer, this.firstSlider,
            this.rangeSliderContainer, this.rangeSlider,
            this.lastSliderContainer, this.lastSlider
        ].forEach((div) => div.classList.add(def.horizontalClass));
        super.createInHrangeElements();
        super.updatePositions();
    }
    _updateHorizontalPosition(val, container) {
        let offsetTop = this.dualRangeElement.offsetTop;
        let offsetLeft = this.dualRangeElement.offsetLeft;
        let eleWidth = this.dualRangeElement.clientWidth;
        let eleHeight = this.dualRangeElement.clientHeight;
        let percentage = val;

        let top = offsetTop;
        let left = offsetLeft + percentage * eleWidth - this.firstSliderContainer.clientWidth/2;
        container.style.top = `${top - window.scrollY}px`;
        container.style.left = `${left - window.scrollX}px`;
        container.style.height = `${eleHeight}px`;
    }
    updateFirstPosition(val) {
        this._updateHorizontalPosition(val, this.firstSliderContainer);
    }
    updateLastPosition(val) {
        this._updateHorizontalPosition(val, this.lastSliderContainer);
    }
    updateRange(val1, val2) {
        if(typeof val1 === 'number' && !isNaN(val1)) {
            let oldLeft = this.rangeSliderContainer.offsetLeft;
            let oldWidth = this.rangeSliderContainer.clientWidth;
            let oldRight = oldLeft + oldWidth;
            let percentage = val1;
            let newLeft = this.dualRangeElement.offsetLeft - window.scrollX + percentage * this.dualRangeElement.clientWidth;
            let newWidth = oldRight - newLeft;
            this.rangeSliderContainer.style.left = `${newLeft}px`;
            this.rangeSliderContainer.style.width = `${newWidth}px`;
        }

        if(typeof val2 === 'number' && !isNaN(val2)) {
            let oldLeft = this.rangeSliderContainer.offsetLeft;
            let percentage = val2;
            let newRight = this.dualRangeElement.offsetLeft
                + percentage * this.dualRangeElement.clientWidth;
            let newWidth = newRight - oldLeft;
            this.rangeSliderContainer.style.width = `${newWidth - window.scrollX}px`;
        }

        this.rangeSliderContainer.style.top = `${this.dualRangeElement.offsetTop - window.scrollY}px`;
        this.rangeSliderContainer.style.height = `${this.dualRangeElement.clientHeight}px`;
    }
    getMouseValue(event) {
        let clientX =  event.touches ? event.touches.item(0).clientX : event.clientX;
        let relativeX = clientX - this.dualRangeElement.offsetLeft + window.scrollX;
        let percentage = relativeX / this.dualRangeElement.clientWidth;
        return percentage;
    }

    // override
    static getObject(id) {
        if(typeof DualRange.dict[id] !== 'undefined') {
            return DualRange.dict[id];
        } else return DualHRange(id);
    }
}
