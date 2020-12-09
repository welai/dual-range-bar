import DualRange from './DualRange';
import def from './definitions';

export default class DualHRange extends DualRange {
    constructor(htmlElement) {
        super(htmlElement);
        if(DualRange.dict[htmlElement.id]) return;
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
        let eleWidth = this.dualRangeElement.clientWidth;
        let eleHeight = this.dualRangeElement.clientHeight;
        let percentage = val;

        let left = percentage * eleWidth - this.firstSliderContainer.clientWidth/2;
        container.style.top = '0px';
        container.style.left = `${left}px`;
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
            let newLeft = percentage * this.dualRangeElement.clientWidth;
            let newWidth = oldRight - newLeft;
            this.rangeSliderContainer.style.left = `${newLeft}px`;
            this.rangeSliderContainer.style.width = `${newWidth}px`;
        }

        if(typeof val2 === 'number' && !isNaN(val2)) {
            let oldLeft = this.rangeSliderContainer.offsetLeft;
            let percentage = val2;
            let newRight = percentage * this.dualRangeElement.clientWidth;
            let newWidth = newRight - oldLeft;
            this.rangeSliderContainer.style.width = `${newWidth}px`;
        }

        this.rangeSliderContainer.style.top = '0px';
        this.rangeSliderContainer.style.height = `${this.dualRangeElement.clientHeight}px`;
    }
    getMouseValue(event) {
        let clientX = event.touches ? event.touches.item(0).pageX : event.pageX;
        let relativeX = clientX - DualRange._getOffsetX(this.dualRangeElement);
        let percentage = relativeX / this.dualRangeElement.clientWidth;
        return percentage;
    }

    // override
    static getObject(id) {
        if(!DualRange.dict) {
            DualRange.dict = {};
        }
        if(typeof DualRange.dict[id] !== 'undefined') {
            return DualRange.dict[id];
        } else return new DualHRange(id);
    }
}