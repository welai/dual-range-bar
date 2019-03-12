/**
 * Common logic for a dual range bar object
 * @author Celestial Phineas
 */

export default class DualRange {
  /** Container element */
  htmlElement: HTMLDivElement;
  /** Background div of the bar */
  backgroundDiv: HTMLDivElement;
  /** First slider div element */
  firstSliderDiv: HTMLDivElement;
  /** Range slider div element */
  rangeSliderDiv: HTMLDivElement;
  /** Last slider div element */
  lastSliderDiv: HTMLDivElement;
  
  // The relative values always range from 0 to 1
  // Range variables are the values of the sliders
  private _relativeLowerRange = 0;
  private _relativeUpperRange = 1;
  private _relativeMinSpan = 0.1;
  private _relativeStep = 0;
  /** Relative lower range */
  get relativeLowerRange(): number { return this._relativeLowerRange; }
  set relativeLowerRange(val: number) {
    if(val > this._relativeUpperRange || val < 0) {
      throw Error(`${val} is not a valid number for relativeLowerRange`);
    }
    this._relativeUpperRange = val;
  }
  /** Relative upper range */
  get relativeUpperRange(): number { return this._relativeUpperRange; }
  set relativeUpperRange(val: number) {
    if(val < this._relativeLowerRange || val > 1) {
      throw Error(`${val} is not a valid number for relativeUpperRange`);
    }
    this._relativeUpperRange = val;
  }
  /** Relative minimum difference of the upper range and lower range */
  get relativeMinSpan(): number { return this._relativeMinSpan; }
  set relativeMinSpan(val: number) {
    if(val < 0 || val > 1) {
      throw Error(`${val} is not a valid number for relativeMinSpan`);
    }
    this._relativeMinSpan = val;
  }
  /** Relative step */
  get relativeStep(): number { return this._relativeStep; }
  set relativeStep(val: number) {
    if(val < 0 || val > 1) {
      throw Error(`${val} is not a valid number for relativeStep`);
    }
    this._relativeStep = val;
  }

  // The bound defines the boundary of possible values 
  /** Minimum possible value */
  // TODO: The lower boundary and upper boundary are for test use here!
  // change their values later
  lowerBoundary = 1;
  /** Maximum possible value */
  upperBoundary = 10;

  // The absolute values are synchronized with the relative values
  /** Absolute lower range */
  get lowerRange(): number {
    const absoluteSpan = this.upperBoundary - this.lowerBoundary;
    return this.relativeLowerRange * absoluteSpan + this.lowerBoundary;
  }
  set lowerRange(lower: number) {
    const absoluteSpan = this.upperBoundary - this.lowerBoundary;
    const relativeLowerRange = (lower - this.lowerBoundary)/absoluteSpan;
    if(relativeLowerRange < 0 || relativeLowerRange > 1
      || relativeLowerRange > this.relativeUpperRange) {
      throw Error(`${lower} is not a valid number for lowerRange`);
    }
  }
  /** Absolute upper range */
  get upperRange(): number {
    const absoluteSpan = this.upperBoundary - this.lowerBoundary;
    return this.relativeUpperRange * absoluteSpan + this.lowerBoundary;
  }
  set upperRange(upper: number) {
    const absoluteSpan = this.upperBoundary - this.lowerBoundary;
    const relativeUpperRange = (upper - this.lowerBoundary)/absoluteSpan;
    if(relativeUpperRange < 0 || relativeUpperRange > 1
      || relativeUpperRange < this.relativeLowerRange) {
      throw Error(`${upper} is not a valid number for upperRange`);
    }
  }
  /** Absolute min span */
  get minSpan(): number {
    const absoluteSpan = this.upperBoundary - this.lowerBoundary;
    return Math.abs(this.relativeMinSpan * absoluteSpan);
  }
  set minSpan(span: number) {
    const absoluteSpan = this.upperBoundary - this.lowerBoundary;
    const relativeMinSpan = Math.abs(span / absoluteSpan);
    if(relativeMinSpan > 1) {
      throw Error(`${span} is not a valid number for minSpan`)
    }
  }
  /** Absolute step */
  get step(): number {
    const absoluteSpan = this.upperBoundary - this.lowerBoundary;
    return Math.abs(this.relativeStep * absoluteSpan);
  }
  set step(val: number) {
    const absoluteSpan = this.upperBoundary - this.lowerBoundary;
    const relativeStep = Math.abs(val / absoluteSpan);
    if(relativeStep > 1) {
      throw Error(`${val} is not a valid number for step.`);
    }
  }

  /**
   * @constructor
   * @param {string | HTMLDivElement} htmlElement The container element of the dual range bar
   */
  protected constructor(htmlElement: string | HTMLDivElement) {
    if(htmlElement as string) {
      this.htmlElement = document.getElementById(htmlElement as string) as HTMLDivElement;
    } else {
      this.htmlElement = htmlElement as HTMLDivElement;
    }
    // Throw an error if failed
    if(!this.htmlElement) {
      throw Error(`${htmlElement} is not a <div> element.`);
    }
    // Set class for the container

    const sliderDivClass = 'dual-div';
    // Initialize the background
    this.backgroundDiv = document.createElement('div');
    this.backgroundDiv.classList.add('dual-bg');
    // Initialize the sliders
    this.firstSliderDiv = document.createElement('div');
    this.firstSliderDiv.classList.add(sliderDivClass, 'dual-first');
    this.rangeSliderDiv = document.createElement('div');
    this.rangeSliderDiv.classList.add(sliderDivClass, 'dual-range');
    this.lastSliderDiv = document.createElement('div');
    this.lastSliderDiv.classList.add(sliderDivClass, 'dual-last');

    // Insert the DOMs
    this.htmlElement.appendChild(this.firstSliderDiv);
    this.htmlElement.appendChild(this.firstSliderDiv);
    this.htmlElement.appendChild(this.rangeSliderDiv);
    this.htmlElement.appendChild(this.lastSliderDiv);
  }
}