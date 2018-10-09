// Type definition for dual-range-bar
// Project: https://github.com/celestialphineas/dual-range-bar
// Definitions by: Celestial Phineas <https://github.com/celestialphineas>
// TypeScript Version: 3.0

// import dual from 'dist/dual-range-bar.min.js';
declare class DualRange {
    constructor(element: HTMLElement | string);
    lowerBound: number;
    upperBound: number;
    lowerRange: number;
    upperRange: number;
    relativeLower: number;
    relativeUpper: number;
    minDifference: number;
    relativeMinDifference: number;
    maxDifference: number;
    relativeMaxDifference: number;
    // These setting functions won't call the callbacks
    setLowerBound: (newVal: number) => void;
    setUpperBound: (newVal: number) => void;
    setLowerRange: (newVal: number) => void;
    setUpperRange: (newVal: number) => void;
    setRelativeLower: (newVal: number) => void;
    setRelativeUpper: (newVal: number) => void;
    setMinDifference: (newVal: number) => void;
    setRelativeMinDifference: (newVal: number) => void;
    setMaxDifference: (newVal: number) => void;
    setRelativeMaxDifference: (newVal: number) => void;
    htmlElement: HTMLElement;
    addLowerRangeChangeCallback: (callback: (newVal: number) => void) => void;
    addUpperRangeChangeCallback: (callback: (newVal: number) => void) => void;
    addLowerBoundChangeCallback: (callback: (newVal: number) => void) => void;
    addUpperBoundChangeCallback: (callback: (newVal: number) => void) => void;
    addMinDifferenceChangeCallback: (callback: (newVal: number) => void) => void;
    addRelativeMinDifferenceChangeCallback: (callback: (newVal: number) => void) => void;
    addMaxDifferenceChangeCallback: (callback: (newVal: number) => void) => void;
    addRelativeMaxDifferenceChangeCallback: (callback: (newVal: number) => void) => void;
    removeLowerRangeChangeCallback: (callback: (newVal: number) => void) => void;
    removeUpperRangeChangeCallback: (callback: (newVal: number) => void) => void;
    removeLowerBoundChangeCallback: (callback: (newVal: number) => void) => void;
    removeUpperBoundChangeCallback: (callback: (newVal: number) => void) => void;
    removeMinDifferenceChangeCallback: (callback: (newVal: number) => void) => void;
    removeRelativeMinDifferenceChangeCallback: (callback: (newVal: number) => void) => void;
    removeMaxDifferenceChangeCallback: (callback: (newVal: number) => void) => void;
    removeRelativeMaxDifferenceChangeCallback: (callback: (newVal: number) => void) => void;
    updatePositions: () => void;
    static getObject: (id: string) => DualRange | null;
}

export declare class HRange extends DualRange {}
export declare class VRange extends DualRange {}
