import def from './definitions';

export default class DualRange {
    // This constructor should never be called directly
    constructor(htmlElement) {
        // Handle parameters
        if(typeof htmlElement === 'string') {
            htmlElement = document.getElementById(htmlElement);
        }

        // Store this in a static variable
        if(!DualRange.dict) DualRange.dict = {};
        DualRange.dict[htmlElement.id] = this;

        var dualRangeElement = this.dualRangeElement = htmlElement;

        this.backgroundDiv          = document.createElement('div');
        this.backgroundDiv.classList.add(def.backgroundClass);

        this.firstSliderContainer   = document.createElement('div');
        this.firstSliderContainer.classList.add(def.firstClass, def.containerClass);
        this.firstSlider            = this.firstSliderContainer.appendChild(document.createElement('button'));
        this.firstSlider.classList.add(def.firstClass, def.sliderClass);

        this.rangeSliderContainer   = document.createElement('div');
        this.rangeSliderContainer.classList.add(def.rangeClass, def.containerClass);
        this.rangeSlider            = this.rangeSliderContainer.appendChild(document.createElement('button'));
        this.rangeSlider.classList.add(def.rangeClass, def.sliderClass);

        this.lastSliderContainer    = document.createElement('div');
        this.lastSliderContainer.classList.add(def.lastClass, def.containerClass);
        this.lastSlider             = this.lastSliderContainer.appendChild(document.createElement('button'));
        this.lastSlider.classList.add(def.lastClass, def.sliderClass);

        function getEleAttVal(att, fallback) {
            let attVal = dualRangeElement.getAttribute(att);
            if(attVal) {
                attVal = Number.parseFloat(attVal);
                if(!isNaN(attVal)) return attVal;
            } 
            return fallback;
        }
        // Some members hided by naming
        this._lowerBound = getEleAttVal(def.lowerBoundAtt, 0);
        this._upperBound = getEleAttVal(def.upperBoundAtt, 1);
        this._relativeLower = 0;
        this._relativeUpper = 1;
        // Function type: (newValue: number) => void
        this._setLowerBoundCallbacks = [];
        this._setUpperBoundCallbacks = [];

        this._minDifference = getEleAttVal(def.minDiffAtt, 0.1);
        this._relativeDifference = Math.abs(this._minDifference/(this._upperBound - this._lowerBound));
        if(this._relativeDifference < 0.05 || this._relativeDifference > 1) {
            this._relativeDifference = 0.1;
            this._minDifference = _relativeDifference * (this._upperBound - this._lowerBound);
        }
        // Function type: (newValue: number) => void
        this._setLowerRangeCallbacks = [];
        this._setUpperRangeCallbacks = [];

        // Add callbacks for re-positioning
        window.addEventListener('resize', () => { this.updatePositions.call(this) });
        dualRangeElement.addEventListener('change', () => { this.updatePositions.call(this) });

        // Binding mouse events
        this._bindMouseEvents();

        // Call update positions when values updated
        this.addLowerRangeChangeCallback((val) => {
            this.updateFirstPosition(val);
            this.updateRange(val, null);
        });
        this.addUpperRangeChangeCallback((val) => {
            this.updateLastPosition(val);
            this.updateRange(null, val);
        });
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
    get lowerRange() { return this._relativeLower * (this._upperBound - this._lowerBound) + this._relativeLower; }
    set lowerRange(newVal) {
        this._relativeLower = (newVal - this._lowerBound)/(this._upperBound - this._lowerBound);
        this._setLowerRangeCallbacks.forEach((fun) => {
            fun.apply(window, [newVal]);
        });
    }
    get upperRange() { return this._relativeUpper * (this._upperBound - this._lowerBound) + this._relativeLower; }
    set upperRange(newVal) {
        this._relativeUpper = (newVal - this._lowerBound)/(this._upperBound - this._lowerBound);
        this._setUpperRangeCallbacks.forEach((fun) => {
            fun.apply(window, [newVal]);
        });
    }
    get relativeLower() { return this._relativeLower; }
    set relativeLower(newVal) {
        this._relativeLower = newVal;
        this._setLowerRangeCallbacks.forEach((fun) => {
            fun.apply(window, [newVal]);
        });
    }
    get relativeUpper() { return this._relativeUpper; }
    set relativeUpper(newVal) {
        this._relativeUpper = newVal;
        this._setUpperRangeCallbacks.forEach((fun) => {
            fun.apply(window, [newVal]);
        });
    }
    // Methods
    _bindMouseEvents() {
        // Handle mouse events
        // State parameters
        this._latestMouseActiveValue = null;
        this._firstMouseDown = false;
        this._rangeMouseDown = false;
        this._lastMouseDown = false;
        this._firstMouseOn = false;
        this._rangeMouseOn = false;
        this._lastMouseOn = false;
        this.firstSlider.addEventListener('mouseenter', (event) => { this._firstMouseOn = true; });
        this.rangeSlider.addEventListener('mouseenter', (event) => { this._rangeMouseOn = true; });
        this.lastSlider.addEventListener('mouseenter', (event) => { this._lastMouseOn = true; });
        this.firstSlider.addEventListener('mouseleave', (event) => { this._firstMouseOn = false; });
        this.rangeSlider.addEventListener('mouseleave', (event) => { this._rangeMouseOn = false; });
        this.lastSlider.addEventListener('mouseleave', (event) => { this._lastMouseOn = false; });
        window.addEventListener('mousedown', (event) => {
            this._latestMouseActiveValue = this.getMouseValue(event);
            [this._firstMouseDown, this._rangeMouseDown, this._lastMouseDown]
                = [this._firstMouseOn, this._rangeMouseOn, this._lastMouseOn];
        })
        window.addEventListener('mouseup', (event) => {['_firstMouseDown', '_rangeMouseDown', '_lastMouseDown'].map((prop) => {this[prop] = false});})
        window.addEventListener('mousemove', (event) => {
            if(this._firstMouseDown) {
                var val = this.getMouseValue(event);
                if(val < 0) {
                    this.relativeLower = 0;
                } else if(val >= 0 && val <= this._relativeUpper - this._relativeDifference) {
                    this.relativeLower = val;
                } else {
                    if(val <= 1 - this._relativeDifference) {
                        this.relativeLower = val;
                        this.relativeUpper = val + this._relativeDifference;
                    } else {
                        this.relativeLower = this._relativeUpper - this._relativeDifference;
                    }
                }
            }
            if(this._rangeMouseDown) {
                var val = this.getMouseValue(event);
                var d = val - this._latestMouseActiveValue;
                this._latestMouseActiveValue = val;
                if(this._relativeLower + d < 0) {
                    this.relativeUpper = this._relativeUpper - this._relativeLower;
                    this.relativeLower = 0;
                } else if(this._relativeUpper + d > 1) {
                    this.relativeLower = 1 - (this._relativeUpper - this._relativeLower);
                    this.relativeUpper = 1;
                } else {
                    this.relativeLower = this._relativeLower + d;
                    this.relativeUpper = this._relativeUpper + d;
                }
            }
            if(this._lastMouseDown) {
                var val = this.getMouseValue(event);
                if(val < this._relativeLower + this._relativeDifference) {
                    if(val >= this._relativeDifference) {
                        this.relativeUpper = val;
                        this.relativeLower = val - this._relativeDifference;
                    } else {
                        this.relativeUpper = this._relativeLower + this._relativeDifference;
                    }
                } else if(val >= this._relativeLower + this._relativeDifference && val <= 1) {
                    this.relativeUpper = val;
                } else {
                    this.relativeUpper = 1;
                }
            }
        });
        this.rangeSlider.addEventListener('mousewheel', (event) => {
            let val = this.getMouseValue(event);
            let d = event.wheelDelta/1000;
            let expectedLowerRange = this._relativeLower + (val - this._relativeLower) * d;
            let expectedUpperRange = this._relativeUpper - (this._relativeUpper - val) * d;
            if(expectedLowerRange < 0) expectedLowerRange = 0;
            if(expectedUpperRange > 1) expectedUpperRange = 1;
            if(expectedUpperRange - expectedLowerRange < this._relativeDifference) {
                expectedLowerRange = expectedUpperRange - this._relativeDifference;
                if(expectedLowerRange < 0) {
                    expectedLowerRange = 0;
                    expectedUpperRange = this._relativeDifference;
                }
            }
            this.relativeLower = expectedLowerRange;
            this.relativeUpper = expectedUpperRange;
        });
        this.backgroundDiv.addEventListener('mousewheel', (event) => {
            let d = -event.wheelDelta/2500;
            let expectedLowerRange = this._relativeLower + d;
            let expectedUpperRange = this._relativeUpper + d;
            if(expectedLowerRange < 0) {
                expectedLowerRange = 0;
                expectedUpperRange = this._relativeUpper - this._relativeLower;
            }
            if(expectedUpperRange > 1) {
                expectedUpperRange = 1;
                expectedLowerRange = 1 - (this._relativeUpper - this._relativeLower);
            }
            this.relativeLower = expectedLowerRange;
            this.relativeUpper = expectedUpperRange;
        });
    }
    // callback: (newValue: number) => void
    addLowerRangeChangeCallback(callback) { this._setLowerRangeCallbacks.push(callback); }
    addUpperRangeChangeCallback(callback) { this._setUpperRangeCallbacks.push(callback); }
    addLowerBoundChangeCallback(callback) { this._setLowerBoundCallbacks.push(callback); }
    addUpperBoundChangeCallback(callback) { this._setUpperBoundCallbacks.push(callback); }

    createInHrangeElements() {
        this.dualRangeElement.appendChild(this.backgroundDiv);
        this.dualRangeElement.appendChild(this.firstSliderContainer);
        this.dualRangeElement.appendChild(this.rangeSliderContainer);
        this.dualRangeElement.appendChild(this.lastSliderContainer);
    }
    updatePositions() {
        this.updateFirstPosition(this._relativeLower);
        this.updateRange(this._relativeLower, this._relativeUpper);
        this.updateLastPosition(this._relativeUpper);
    }
    // updateFirstPosition(val: number) => void
    updateFirstPosition(val) {}
    // updateRange(val1: number, val2: number) => void
    updateRange(val1, val2) {}
    // updateLastPosition(val: number) => void
    updateLastPosition(val) {}

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
