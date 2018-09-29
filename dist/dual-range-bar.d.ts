// Type definition for dual-range-bar
// Project: https://github.com/celestialphineas/dual-range-bar
// Definitions by: Celestial Phineas <https://github.com/celestialphineas>
// TypeScript Version: 3.0

// import dual from 'dist/dual-range-bar.min.js';
declare class DualRange {
    lowerBound: number;
    upperBound: number;
    lowerRange: number;
    upperRange: number;
    relativeLower: number;
    relativeUpper: number;
    addLowerRangeChangeCallback: (newValue: number) => void;
    addUpperRangeChangeCallback: (newValue: number) => void;
    addLowerBoundChangeCallback: (newValue: number) => void;
    addUpperBoundChangeCallback: (newValue: number) => void;
    updatePositions: () => void;
    getMouseValue: (event: Event) => number;
    static getObject: (id: string) => DualRange | null;
}

export declare class HRange extends DualRange {}
export declare class VRange extends DualRange {}
