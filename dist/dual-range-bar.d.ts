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
    htmlElement: HTMLElement;
    addLowerRangeChangeCallback: (callback: (newValue: number) => void) => void;
    addUpperRangeChangeCallback: (callback: (newValue: number) => void) => void;
    addLowerBoundChangeCallback: (callback: (newValue: number) => void) => void;
    addUpperBoundChangeCallback: (callback: (newValue: number) => void) => void;
    removeLowerRangeChangeCallback: (callback: (newValue: number) => void) => void;
    removeUpperRangeChangeCallback: (callback: (newValue: number) => void) => void;
    removeLowerBoundChangeCallback: (callback: (newValue: number) => void) => void;
    removeUpperBoundChangeCallback: (callback: (newValue: number) => void) => void;
    updatePositions: () => void;
    static getObject: (id: string) => DualRange | null;
}

export declare class HRange extends DualRange {}
export declare class VRange extends DualRange {}
