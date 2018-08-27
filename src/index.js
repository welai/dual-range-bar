import './style.css';

const dualHrangeClassName = 'dual-hrange';
const dualVrangeClassName = 'dual-vrange';

let dualHranges = document.getElementsByClassName(dualHrangeClassName);
let dualVranges = document.getElementsByClassName(dualVrangeClassName);

class DualRange {
    constructor(htmlElement) {
        if(typeof htmlElement === 'string') {
            htmlElement = document.getElementById(htmlElement);
        }

        // Store this in the static 
        if(!DualRange.dict) DualRange.dict = {};
        DualRange.dict[htmlElement.id] = this;

        var dualRangeElement = this.dualRangeElement = htmlElement;

        this.backgroundDiv          = document.createElement('div');
        this.backgroundDiv.classList.add('dual-background');

        this.firstSliderContainer   = document.createElement('div');
        this.firstSliderContainer.classList.add('dual-first', 'dual-container');
        this.firstSlider            = this.firstSliderContainer.appendChild(document.createElement('div'));
        this.firstSlider.classList.add('dual-first', 'dual-slider');

        this.rangeSliderContainer   = document.createElement('div');
        this.rangeSliderContainer.classList.add('dual-range', 'dual-container');
        this.rangeSlider            = this.rangeSliderContainer.appendChild(document.createElement('div'));
        this.rangeSlider.classList.add('dual-range', 'dual-slider');

        this.lastSliderContainer    = document.createElement('div');
        this.lastSliderContainer.classList.add('dual-last', 'dual-container');
        this.lastSlider             = this.lastSliderContainer.appendChild(document.createElement('div'));
        this.lastSlider.classList.add('dual-last', 'dual-slider');

        function getEleAttVal(att, fallback) {
            let attVal = dualRangeElement.getAttribute(att);
            if(attVal) {
                attVal = Number.parseFloat(attVal);
                if(!isNaN(attVal)) return attVal;
            } 
            return fallback;
        }
        // Some members hided by naming
        this._lowerBound = getEleAttVal('lower-bound', 0);
        this._upperBound = getEleAttVal('upper-bound', 1);
        // Function type: (newValue: number) => void
        this._setLowerBoundCallbacks = [];
        this._setUpperBoundCallbacks = [];

        this._lowerRange = getEleAttVal('lower-range', 0);
        this._upperRange = getEleAttVal('upper-range', 1);
        // Function type: (newValue: number) => void
        this._setLowerRangeCallbacks = [];
        this._setUpperRangeCallbacks = [];
    }
    // Value members
    get lowerBound() { return this._lowerBound; }
    set lowerBound(newVal) {
        this._lowerBound = newVal;
        this._setLowerBoundCallbacks.forEach((fun) => {
            fun.apply(window, [newVal]);
        });
    }
    get upperBound() { return this._upperBound; }
    set upperBound(newVal) {
        this._upperBound = newVal;
        this._setUpperBoundCallbacks.forEach((fun) => {
            fun.apply(window, [newVal]);
        });
    }
    get lowerRange() { return this._lowerRange; }
    set lowerRange(newVal) {
        this._lowerRange = newVal;
        this._setLowerRangeCallbacks.forEach((fun) => {
            fun.apply(window, [newVal]);
        });
    }
    get upperRange() { return this._upperRange; }
    set upperRange(newVal) {
        this._upperRange = newVal;
        this._setUpperRangeCallbacks.forEach((fun) => {
            fun.apply(window, [newVal]);
        });
    }
    // Methods
    createInHrangeElements() {
        this.dualRangeElement.appendChild(this.backgroundDiv);
        this.dualRangeElement.appendChild(this.firstSliderContainer);
        this.dualRangeElement.appendChild(this.rangeSliderContainer);
        this.dualRangeElement.appendChild(this.lastSliderContainer);
    }
    initPositions() {
        this.updateFirstPosition(this._lowerRange);
        this.updateRange(this._lowerRange, this._upperRange);
        this.updateLastPosition(this._upperRange);
    }
    // This static function is used to get the DualRange object
    static getObject(id) {
        if(typeof DualRange.dict[id] !== 'undefined') {
            return DualRange.dict[id];
        } else {
            let ele = document.getElementById(id);
            if(ele.classList.contains(dualHrangeClassName)) {
                return DualHRange(id);
            } else if(ele.classList.contains(dualVrangeClassName)) {
                return DualVRange(id);
            } else return null;
        }
    }
}

class DualHRange extends DualRange {
    constructor(htmlElement) {
        super(htmlElement);
        [
            this.backgroundDiv,
            this.firstSliderContainer, this.firstSlider,
            this.rangeSliderContainer, this.rangeSlider,
            this.lastSliderContainer, this.lastSlider
        ].forEach((div) => div.classList.add('dual-horizontal'));
        super.createInHrangeElements();
        super.initPositions();
    }
    _updateHorizontalPosition(val, container) {
        let offsetTop = this.dualRangeElement.offsetTop;
        let offsetLeft = this.dualRangeElement.offsetLeft;
        let eleWidth = this.dualRangeElement.clientWidth;
        let eleHeight = this.dualRangeElement.clientHeight;
        let percentage = (val - this.lowerBound)/(this.upperBound - this.lowerBound);

        let top = offsetTop;
        let left = offsetLeft + percentage * eleWidth - this.firstSliderContainer.clientWidth/2;
        container.style.top = `${top}px`;
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
            let percentage = (val1 - this.lowerBound)/(this.upperBound - this.lowerBound);
            let newLeft = this.dualRangeElement.offsetLeft
                + percentage * this.dualRangeElement.clientWidth;
            let newWidth = oldRight - newLeft;
            this.rangeSliderContainer.style.left = `${newLeft}px`;
            this.rangeSliderContainer.style.width = `${newWidth}px`;
        }

        if(typeof val2 === 'number' && !isNaN(val2)) {
            let oldLeft = this.rangeSliderContainer.offsetLeft;
            let percentage = (val2 - this.lowerBound)/(this.upperBound - this.lowerBound);
            let newRight = this.dualRangeElement.offsetLeft
                + percentage * this.dualRangeElement.clientWidth;
            let newWidth = newRight - oldLeft;
            this.rangeSliderContainer.style.width = `${newWidth}px`;
        }

        this.rangeSliderContainer.style.top = `${this.dualRangeElement.offsetTop}px`;
        this.rangeSliderContainer.style.height = `${this.dualRangeElement.clientHeight}px`;
    }

    // override
    static getObject(id) {
        if(typeof DualRange.dict[id] !== 'undefined') {
            return DualRange.dict[id];
        } else return DualHRange(id);
    }
}

class DualVRange extends DualRange {
    constructor(htmlElement) {
        super(htmlElement);
        [
            this.backgroundDiv,
            this.firstSliderContainer, this.firstSlider,
            this.rangeSliderContainer, this.rangeSlider,
            this.lastSliderContainer, this.lastSlider
        ].forEach((div) => div.classList.add('dual-vertical'));
        super.createInHrangeElements();
        super.initPositions();
    }
    _updateVerticalPosition(val, container) {
        let offsetTop = this.dualRangeElement.offsetTop;
        let offsetLeft = this.dualRangeElement.offsetLeft;
        let eleWidth = this.dualRangeElement.clientWidth;
        let eleHeight = this.dualRangeElement.clientHeight;
        let percentage = (val - this.lowerBound)/(this.upperBound - this.lowerBound);

        let top = offsetTop + percentage * eleHeight - this.firstSliderContainer.clientHeight/2;
        let left = offsetLeft;
        container.style.top = `${top}px`;
        container.style.left = `${left}px`;
        container.style.width = `${eleWidth}px`;
    }
    updateFirstPosition(val) {
        this._updateVerticalPosition(val, this.firstSliderContainer);
    }
    updateLastPosition(val) {
        this._updateVerticalPosition(val, this.lastSliderContainer);
    }
    updateRange(val1, val2) {
        if(typeof val1 === 'number' && !isNaN(val1)) {
            let oldTop = this.rangeSliderContainer.offsetTop;
            let oldHeight = this.rangeSliderContainer.clientHeight;
            let oldBottom = oldTop + oldHeight;
            let percentage = (val1 - this.lowerBound)/(this.upperBound - this.lowerBound);
            let newTop = this.dualRangeElement.offsetTop
                + percentage * this.dualRangeElement.clientHeight;
            let newHeight = oldBottom - newTop;
            this.rangeSliderContainer.style.top = `${newTop}px`;
            this.rangeSliderContainer.style.height = `${newHeight}px`;
        }

        if(typeof val2 === 'number' && !isNaN(val2)) {
            let oldTop = this.rangeSliderContainer.offsetTop;
            let percentage = (val2 - this.lowerBound)/(this.upperBound - this.lowerBound);
            let newBottom = this.dualRangeElement.offsetTop
                + percentage * this.dualRangeElement.clientHeight;
            let newHeight = newBottom - oldTop;
            this.rangeSliderContainer.style.height = `${newHeight}px`;
        }

        this.rangeSliderContainer.style.left = `${this.dualRangeElement.offsetLeft}px`;
        this.rangeSliderContainer.style.width = `${this.dualRangeElement.clientWidth}px`;
    }
    // override
    static getObject(id) {
        if(typeof DualRange.dict[id] !== 'undefined') {
            return DualRange.dict[id];
        } else return DualVRange(id);
    }
}

window.onload = () => {
    for(let i = 0; i < dualHranges.length; i++) {
        new DualHRange(dualHranges[i]);
    }
    for(let i = 0; i < dualVranges.length; i++) { new DualVRange(dualVranges[i]); }
}

export var a = 'a';
