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
    relativeDifference: number;
    _lowerBound: number;
    _upperBound: number;
    _lowerRange: number;
    _upperRange: number;
    _relativeLower: number;
    _relativeUpper: number;
    _minDifference: number;
    _relativeDifference: number;
    htmlElement: HTMLElement;
    addLowerRangeChangeCallback: (callback: (newVal: number) => void) => void;
    addUpperRangeChangeCallback: (callback: (newVal: number) => void) => void;
    addLowerBoundChangeCallback: (callback: (newVal: number) => void) => void;
    addUpperBoundChangeCallback: (callback: (newVal: number) => void) => void;
    addMinDifferenceChangeCallback: (callback: (newVal: number) => void) => void;
    addRelativeDifferenceChangeCallback: (callback: (newVal: number) => void) => void;
    removeLowerRangeChangeCallback: (callback: (newVal: number) => void) => void;
    removeUpperRangeChangeCallback: (callback: (newVal: number) => void) => void;
    removeLowerBoundChangeCallback: (callback: (newVal: number) => void) => void;
    removeUpperBoundChangeCallback: (callback: (newVal: number) => void) => void;
    removeMinDifferenceChangeCallback: (callback: (newVal: number) => void) => void;
    removeRelativeDifferenceChangeCallback: (callback: (newVal: number) => void) => void;
    updatePositions: () => void;
    static getObject: (id: string) => DualRange | null;
}

export declare class HRange extends DualRange {}
export declare class VRange extends DualRange {}
