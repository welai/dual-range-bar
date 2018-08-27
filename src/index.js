import './style.css';

let dualHranges = document.getElementsByClassName('dual-hrange');
let dualVranges = document.getElementsByClassName('dual-vrange');

class DualRange {
    constructor(htmlElement) {
        if(typeof htmlElement === 'string') {
            htmlElement = document.getElementById(htmlElement);
        }
        this.dualRangeElement       = htmlElement;
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
    }
    createInHrangeElements() {
        this.dualRangeElement.appendChild(this.backgroundDiv);
        this.dualRangeElement.appendChild(this.firstSliderContainer);
        this.dualRangeElement.appendChild(this.rangeSliderContainer);
        this.dualRangeElement.appendChild(this.lastSliderContainer);
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
        ].forEach((div) => div.classList.add('dual-hslider'));
        super.createInHrangeElements();
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
        ].forEach((div) => div.classList.add('dual-vslider'));
        super.createInHrangeElements();
    }
}

window.onload = () => {
    for(let i = 0; i < dualHranges.length; i++) { new DualHRange(dualHranges[i]); }
    for(let i = 0; i < dualVranges.length; i++) { new DualVRange(dualVranges[i]); }
}



export var a = 'a';
