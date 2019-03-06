import DualRange from './DualRange';
import def from './definitions';

export default class DualVRange extends DualRange {
    constructor(htmlElement) {
        super(htmlElement);
        if(DualRange.dict[htmlElement.id]) return;
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
        let eleWidth = this.dualRangeElement.clientWidth;
        let eleHeight = this.dualRangeElement.clientHeight;
        let percentage = val;

        let top = percentage * eleHeight - this.firstSliderContainer.clientHeight/2;
        container.style.top = `${top}px`;
        container.style.left = '0px';
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
            let newTop = percentage * this.dualRangeElement.clientHeight;
            let newHeight = oldBottom - newTop;
            this.rangeSliderContainer.style.top = `${newTop}px`;
            this.rangeSliderContainer.style.height = `${newHeight}px`;
        }

        if(typeof val2 === 'number' && !isNaN(val2)) {
            let oldTop = this.rangeSliderContainer.offsetTop;
            let percentage = val2;
            let newBottom = percentage * this.dualRangeElement.clientHeight;
            let newHeight = newBottom - oldTop;
            this.rangeSliderContainer.style.height = `${newHeight}px`;
        }

        this.rangeSliderContainer.style.left = '0px';
        this.rangeSliderContainer.style.width = `${this.dualRangeElement.clientWidth}px`;
    }
    getMouseValue(event) {
        let clientY = event.touches ? event.touches.item(0).pageY : event.pageY;
        let relativeY = clientY - DualRange._getOffsetY(this.dualRangeElement);
        let percentage = relativeY / this.dualRangeElement.clientHeight;
        return percentage;
    }

    // override
    static getObject(id) {
        if(!DualRange.dict) {
            DualRange.dict = {};
        }
        if(typeof DualRange.dict[id] !== 'undefined') {
            return DualRange.dict[id];
        } else return new DualVRange(id);
    }
}
