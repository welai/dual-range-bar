import def from './definitions';

export default class DualRange {
    // This constructor should never be called directly
    constructor(htmlElement) {
        // Handle parameters
        if(typeof htmlElement === 'string') {
            htmlElement = document.getElementById(htmlElement);
        }
        this.htmlElement = htmlElement;

        // Store this in a static variable
        if(!DualRange.dict) DualRange.dict = {};
        if(DualRange.dict[htmlElement.id]) return;
        DualRange.dict[htmlElement.id] = this;

        var dualRangeElement = this.dualRangeElement = htmlElement;
        dualRangeElement.style.textAlign = 'left';

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
        // Function type: (newValue: number) => void
        this._setLowerRangeCallbacks = [];
        this._setUpperRangeCallbacks = [];

        this._minDifference = getEleAttVal(def.minDiffAtt, 0.1);
        this._maxDifference = getEleAttVal(def.maxDiffAtt, 1.0);
        this._relativeMinDifference = Math.abs(this._minDifference/(this._upperBound - this._lowerBound));
        this._relativeMaxDifference = Math.abs(this._maxDifference/(this._upperBound - this._lowerBound));
		if(this._relativeUpper - this._relativeLower > this._relativeMaxDifference) {
			this._relativeUpper = this._relativeLower + this._relativeMaxDifference;
		}
        if(this._relativeMinDifference < 0.05 || this._relativeMinDifference > 1) {
            console.warn(`Invalid setting of ${def.minDiffAtt}, restored to default 0.1`);
            this._relativeMinDifference = 0.1;
            this._minDifference = _relativeMinDifference * (this._upperBound - this._lowerBound);
        }
        if(this._relativeMaxDifference < 0.05 || this._relativeMaxDifference > 1) {
            console.warn(`Invalid setting of ${def.maxDiffAtt}, restored to default 0.1`);
            this._relativeMaxDifference = 0.1;
            this._maxDifference = _relativeMaxDifference * (this._upperBound - this._lowerBound);
        }
        this._setMinDifferenceChangeCallbacks = [];
        this._setMaxDifferenceChangeCallbacks = [];
        this._setRelativeMinDifferenceChangeCallbacks = [];
        this._setRelativeMaxDifferenceChangeCallbacks = [];

        // Add callbacks for re-positioning
        window.addEventListener('resize', () => { this.updatePositions.call(this) });
        window.addEventListener('scroll', () => { this.updatePositions.call(this) });
        document.addEventListener('touchstart', () => { this.updatePositions.call(this) });
        document.addEventListener('touchmove', () => { this.updatePositions.call(this) });
        document.addEventListener('touchend', () => {
            // Call the update a little bit afterwards because of the inertial scrolling
            setTimeout(this.updatePositions.call(this), 500);
        });
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
        this.addLowerBoundChangeCallback((val) => {
            this.updatePositions();
        });
        this.addUpperBoundChangeCallback((val) => {
            this.updatePositions();
        });
    }
    // Value members
    get lowerBound() { return this._lowerBound; }
    set lowerBound(newVal) {
        this._lowerBound = newVal;
        this._setLowerBoundCallbacks.forEach((fun) => {
            fun.apply(window, [newVal]);
        });
        this.updatePositions();
    }
    setLowerBound(newVal) {
        this._lowerBound = newVal;
        this.updatePositions();
    };
    get upperBound() { return this._upperBound; }
    set upperBound(newVal) {
        this._upperBound = newVal;
        this._setUpperBoundCallbacks.forEach((fun) => {
            fun.apply(window, [newVal]);
        });
        this.updatePositions();
    }
    setUpperBound(newVal) {
        this._upperBound = newVal;
        this.updatePositions();
    }
    get lowerRange() { return this._relativeLower * (this._upperBound - this._lowerBound) + this._lowerBound; }
    set lowerRange(newVal) {
        this._relativeLower = (newVal - this._lowerBound)/(this._upperBound - this._lowerBound);
        this._setLowerRangeCallbacks.forEach((fun) => {
            fun.apply(window, [newVal]);
        });
        this.updatePositions();
    }
    setLowerRange(newVal) {
        this._relativeLower = (newVal - this._lowerBound)/(this._upperBound - this._lowerBound);
        this.updatePositions();
    }
    get upperRange() { return this._relativeUpper * (this._upperBound - this._lowerBound) + this._lowerBound; }
    set upperRange(newVal) {
        this._relativeUpper = (newVal - this._lowerBound)/(this._upperBound - this._lowerBound);
        this._setUpperRangeCallbacks.forEach((fun) => {
            fun.apply(window, [newVal]);
        });
        this.updatePositions();
    }
    setUpperRange(newVal) {
        this._relativeUpper = (newVal - this._lowerBound)/(this._upperBound - this._lowerBound);
        this.updatePositions();
    }
    get minDifference() { return this._minDifference; }
    set minDifference(newVal) {
        this._minDifference = newVal;
        this._relativeMinDifference = Math.abs(newVal/(this._upperBound - this._lowerBound));
        this._setMinDifferenceChangeCallbacks.forEach((fun) => {
            fun.apply(window, [newVal]);
        });
        this.updatePositions();
    }
    setMinDifference(newVal) {
        this._minDifference = newVal;
        this._relativeMinDifference = Math.abs(newVal/(this._upperBound - this._lowerBound));
        this.updatePositions();
	}
	get maxDifference() { return this._maxDifference; }
    set maxDifference(newVal) {
        this._maxDifference = newVal;
        this._relativeMaxDifference = Math.abs(newVal/(this._upperBound - this._lowerBound));
        this._setMaxDifferenceChangeCallbacks.forEach((fun) => {
            fun.apply(window, [newVal]);
		});
		if(this._relativeUpper - this._relativeLower > this._relativeMaxDifference) {
			this.relativeUpper = this._relativeLower + this._relativeMaxDifference;
		}
        this.updatePositions();
    }
    setMaxDifference(newVal) {
        this._maxDifference = newVal;
        this._relativeMaxDifference = Math.abs(newVal/(this._upperBound - this._lowerBound));
        this.updatePositions();
    }
    get relativeMinDifference() { return this._relativeMinDifference; }
    set relativeMinDifference(newVal) {
        this._relativeMinDifference = newVal;
        this._minDifference = (this._upperBound - this.lowerBound) * newVal;
        this._setRelativeMinDifferenceChangeCallbacks.forEach((fun) => {
            fun.apply(window, [newVal]);
        });
		if(this._relativeUpper - this._relativeLower > this._relativeMaxDifference) {
			this.relativeUpper = this._relativeLower + this._relativeMaxDifference;
		}
        this.updatePositions();
    }
    setRelativeMaxDifference(newVal) {
        this._relativeMaxDifference = newVal;
        this._maxDifference = (this._upperBound - this.lowerBound) * newVal;
        this.updatePositions();
    }get relativeMaxDifference() { return this._relativeMaxDifference; }
    set relativeMaxDifference(newVal) {
        this._relativeMaxDifference = newVal;
        this._maxDifference = (this._upperBound - this.lowerBound) * newVal;
        this._setRelativeMaxDifferenceChangeCallbacks.forEach((fun) => {
            fun.apply(window, [newVal]);
        });
        this.updatePositions();
    }
    setRelativeMaxDifference(newVal) {
        this._relativeMaxDifference = newVal;
        this._maxDifference = (this._upperBound - this.lowerBound) * newVal;
        this.updatePositions();
    }
    
    get relativeLower() { return this._relativeLower; }
    set relativeLower(newVal) {
        this._relativeLower = newVal;
        this._setLowerRangeCallbacks.forEach((fun) => {
            fun.apply(window, [newVal]);
        });
        this.updatePositions();
    }
    setRelativeLower(newVal) {
        this._relativeLower = newVal;
        this.updatePositions();
    }
    get relativeUpper() { return this._relativeUpper; }
    set relativeUpper(newVal) {
        this._relativeUpper = newVal;
        this._setUpperRangeCallbacks.forEach((fun) => {
            fun.apply(window, [newVal]);
        });
        this.updatePositions();
    }
    setRelativeUpper(newVal) {
        this._relativeUpper = newVal;
        this.updatePositions();
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
        this.firstSlider.addEventListener('touchstart', (event) => { event.preventDefault(); this._firstMouseOn = true; });
        this.rangeSlider.addEventListener('mouseenter', (event) => { this._rangeMouseOn = true; });
        this.rangeSlider.addEventListener('touchstart', (event) => { event.preventDefault(); this._rangeMouseOn = true; });
        this.lastSlider.addEventListener('mouseenter',  (event) => { this._lastMouseOn = true; });
        this.lastSlider.addEventListener('touchstart',  (event) => { event.preventDefault(); this._lastMouseOn = true; });
        this.firstSlider.addEventListener('mouseleave', (event) => { this._firstMouseOn = false; });
        this.firstSlider.addEventListener('touchend',   (event) => { this._firstMouseOn = false; });
        this.rangeSlider.addEventListener('mouseleave', (event) => { this._rangeMouseOn = false; });
        this.rangeSlider.addEventListener('touchend',   (event) => { this._rangeMouseOn = false; });
        this.lastSlider.addEventListener('mouseleave',  (event) => { this._lastMouseOn = false; });
        this.lastSlider.addEventListener('touchend',    (event) => { this._lastMouseOn = false; });
        var windowMouseDownCallback = (event) => {
            this._latestMouseActiveValue = this.getMouseValue(event);
            [this._firstMouseDown, this._rangeMouseDown, this._lastMouseDown]
                = [this._firstMouseOn, this._rangeMouseOn, this._lastMouseOn];
        };
        window.addEventListener('mousedown', windowMouseDownCallback);
        window.addEventListener('touchstart', windowMouseDownCallback);
        var windowMouseUpCallback = (event) => {['_firstMouseDown', '_rangeMouseDown', '_lastMouseDown'].map((prop) => {this[prop] = false});}
        window.addEventListener('mouseup', windowMouseUpCallback);
        window.addEventListener('touchend', windowMouseUpCallback);
        var windowMouseMoveCallback = (event) => {
            if(this._firstMouseDown) {
                var val = this.getMouseValue(event);
                if(val < 0) {
                    this.relativeLower = 0;
                } else if(val > this._relativeUpper - this._relativeMinDifference) {
					if(val <= 1 - this.relativeMinDifference) {
						this.relativeLower = val;
						this.relativeUpper = val + this._relativeMinDifference;
					} else {
						this._relativeLower = this._relativeUpper - this._relativeMinDifference;
					}
				} else if(val < this._relativeUpper - this._relativeMaxDifference) {
					this.relativeLower = val;
					this.relativeUpper = val + this._relativeMaxDifference;
				} else {
					this.relativeLower = val;
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
				if(val > 1) {
					this.relativeUpper = 1;
				} else if(val < this._relativeLower + this._relativeMinDifference) {
					if(val >= this._relativeMinDifference) {
						this.relativeUpper = val;
						this.relativeLower = val - this._relativeMinDifference;
					} else {
						this.relativeUpper = this._relativeLower + this._relativeMinDifference;
					}
				} else if(val > this._relativeLower + this._relativeMaxDifference) {
					this.relativeUpper = val;
					this.relativeLower = val - this._relativeMaxDifference;
				} else {
					this.relativeUpper = val;
				}
            }
        };
        window.addEventListener('mousemove', windowMouseMoveCallback);
        window.addEventListener('touchmove', windowMouseMoveCallback);
        var rangeWheelEvent = (event) => {
            event.preventDefault();
            let val = this.getMouseValue(event);
            let d = (event.wheelDelta || -event.detail * 120 || -event.deltaY * 120)/1000;
            let expectedLowerRange = this._relativeLower + (val - this._relativeLower) * d;
            let expectedUpperRange = this._relativeUpper - (this._relativeUpper - val) * d;
            if(expectedLowerRange < 0) expectedLowerRange = 0;
            if(expectedUpperRange > 1) expectedUpperRange = 1;
            if(expectedUpperRange - expectedLowerRange < this._relativeMinDifference) {
                expectedLowerRange = expectedUpperRange - this._relativeMinDifference;
                if(expectedLowerRange < 0) {
                    expectedLowerRange = 0;
                    expectedUpperRange = this._relativeMinDifference;
                }
            } else if(expectedUpperRange - expectedLowerRange > this._relativeMaxDifference) {
                expectedLowerRange = expectedUpperRange - this._relativeMaxDifference;
				if(expectedUpperRange > 1) {
					expectedUpperRange = 1;
					expectedLowerRange = 1 - this._relativeMaxDifference;
				}
			}
            this.relativeLower = expectedLowerRange;
            this.relativeUpper = expectedUpperRange;
        };
        this.rangeSlider.addEventListener('mousewheel', rangeWheelEvent);
        this.rangeSlider.addEventListener('DOMMouseScroll', rangeWheelEvent);
        var backgroundWheelEvent = (event) => {
            event.preventDefault();
            let d = (-event.wheelDelta || event.detail * 120 || event.deltaY * 120)/2500;
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
        };
        this.backgroundDiv.addEventListener('mousewheel', backgroundWheelEvent);
        this.backgroundDiv.addEventListener('DOMMouseScroll', backgroundWheelEvent);
    }
    // callback: (newValue: number) => void
    addLowerRangeChangeCallback(callback) { this._setLowerRangeCallbacks.push(callback); }
    addUpperRangeChangeCallback(callback) { this._setUpperRangeCallbacks.push(callback); }
    addLowerBoundChangeCallback(callback) { this._setLowerBoundCallbacks.push(callback); }
    addUpperBoundChangeCallback(callback) { this._setUpperBoundCallbacks.push(callback); }
    addMinDifferenceChangeCallback(callback) { this._setMinDifferenceChangeCallbacks.push(callback); }
    addMaxDifferenceChangeCallback(callback) { this._setMaxDifferenceChangeCallbacks.push(callback); }
    addRelativeMinDifferenceChangeCallback(callback) { this._setRelativeMinDifferenceChangeCallbacks.push(callback); }
    addRelativeMaxDifferenceChangeCallback(callback) { this._setRelativeMaxDifferenceChangeCallbacks.push(callback); }
    removeLowerRangeChangeCallback(callback) { let a = this._setLowerRangeCallbacks; let i = a.indexOf(callback); if (i !== -1) a.splice(i, 1); }
    removeUpperRangeChangeCallback(callback) { let a = this._setUpperRangeCallbacks; let i = a.indexOf(callback); if (i !== -1) a.splice(i, 1); }
    removeLowerBoundChangeCallback(callback) { let a = this._setLowerBoundCallbacks; let i = a.indexOf(callback); if (i !== -1) a.splice(i, 1); }
    removeUpperBoundChangeCallback(callback) { let a = this._setUpperBoundCallbacks; let i = a.indexOf(callback); if (i !== -1) a.splice(i, 1); }
    removeMinDifferenceChangeCallback(callback) { let a = this._setMinDifferenceChangeCallbacks; let i = a.indexOf(callback); if (i !== -1) a.splice(i, 1); }
    removeMaxDifferenceChangeCallback(callback) { let a = this._setMaxDifferenceChangeCallbacks; let i = a.indexOf(callback); if (i !== -1) a.splice(i, 1); }
    removeRelativeMinDifferenceChangeCallback(callback) { let a = this._setRelativeMinDifferenceChangeCallbacks; let i = a.indexOf(callback); if (i !== -1) a.splice(i, 1); }
    removeRelativeMaxDifferenceChangeCallback(callback) { let a = this._setRelativeMaxDifferenceChangeCallbacks; let i = a.indexOf(callback); if (i !== -1) a.splice(i, 1); }

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
    // getMouseValue(event: Event) => number
    getMouseValue(event) { return 0; }

    // This static function is used to get the DualRange object
    static getObject(id) {
        if(!DualRange.dict) {
            DualRange.dict = {};
        }
        if(typeof DualRange.dict[id] !== 'undefined') {
            return DualRange.dict[id];
        } else {
            let ele = document.getElementById(id);
            if(ele.classList.contains(dualHrangeClassName)) {
                return new DualHRange(id);
            } else if(ele.classList.contains(dualVrangeClassName)) {
                return new DualVRange(id);
            } else return null;
        }
    }

    // Compute the position relative to the document
    static _getOffsetY(element) {
        var box = element.getBoundingClientRect();
        var body = document.body;
        var docElement = document.documentElement;
        var clientTop = docElement.clientTop || body.clientTop || 0;
        var scrollTop = window.pageYOffset || docElement.scrollTop || body.scrollTop;
        return Math.round(box.top + scrollTop - clientTop);
    }
    static _getOffsetX(element) {
        var box = element.getBoundingClientRect();
        var body = document.body;
        var docElement = document.documentElement;
        var clientLeft = docElement.clientLeft || body.clientLeft || 0;
        var scrollLeft = window.pageXOffset || docElement.scrollLeft || body.scrollLeft;
        return Math.round(box.left + scrollLeft - clientLeft);
    }
}
