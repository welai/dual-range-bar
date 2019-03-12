(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["dual-range-bar"] = factory();
	else
		root["dual-range-bar"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/DualHRange.ts":
/*!***************************!*\
  !*** ./src/DualHRange.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar DualRange_1 = __webpack_require__(/*! ./DualRange */ \"./src/DualRange.ts\");\nvar DualHRange = /** @class */ (function (_super) {\n    __extends(DualHRange, _super);\n    function DualHRange(htmlElement) {\n        return _super.call(this, htmlElement) || this;\n    }\n    return DualHRange;\n}(DualRange_1.default));\nexports.default = DualHRange;\n\n\n//# sourceURL=webpack://dual-range-bar/./src/DualHRange.ts?");

/***/ }),

/***/ "./src/DualRange.ts":
/*!**************************!*\
  !*** ./src/DualRange.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * Common logic for a dual range bar object\n * @author Celestial Phineas\n */\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar DualRange = /** @class */ (function () {\n    /**\n     * @constructor\n     * @param {string | HTMLDivElement} htmlElement The container element of the dual range bar\n     */\n    function DualRange(htmlElement) {\n        // The relative values always range from 0 to 1\n        // Range variables are the values of the sliders\n        this._relativeLowerRange = 0;\n        this._relativeUpperRange = 1;\n        this._relativeMinSpan = 0.1;\n        this._relativeStep = 0;\n        // The bound defines the boundary of possible values \n        /** Minimum possible value */\n        // TODO: The lower boundary and upper boundary are for test use here!\n        // change their values later\n        this.lowerBoundary = 1;\n        /** Maximum possible value */\n        this.upperBoundary = 10;\n        if (htmlElement) {\n            this.htmlElement = document.getElementById(htmlElement);\n        }\n        else {\n            this.htmlElement = htmlElement;\n        }\n        // Throw an error if failed\n        if (!this.htmlElement) {\n            throw Error(htmlElement + \" is not a <div> element.\");\n        }\n        // Set class for the container\n        var sliderDivClass = 'dual-div';\n        // Initialize the background\n        this.backgroundDiv = document.createElement('div');\n        this.backgroundDiv.classList.add('dual-bg');\n        // Initialize the sliders\n        this.firstSliderDiv = document.createElement('div');\n        this.firstSliderDiv.classList.add(sliderDivClass, 'dual-first');\n        this.rangeSliderDiv = document.createElement('div');\n        this.rangeSliderDiv.classList.add(sliderDivClass, 'dual-range');\n        this.lastSliderDiv = document.createElement('div');\n        this.lastSliderDiv.classList.add(sliderDivClass, 'dual-last');\n        // Insert the DOMs\n        this.htmlElement.appendChild(this.firstSliderDiv);\n        this.htmlElement.appendChild(this.firstSliderDiv);\n        this.htmlElement.appendChild(this.rangeSliderDiv);\n        this.htmlElement.appendChild(this.lastSliderDiv);\n    }\n    Object.defineProperty(DualRange.prototype, \"relativeLowerRange\", {\n        /** Relative lower range */\n        get: function () { return this._relativeLowerRange; },\n        set: function (val) {\n            if (val > this._relativeUpperRange || val < 0) {\n                throw Error(val + \" is not a valid number for relativeLowerRange\");\n            }\n            this._relativeUpperRange = val;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(DualRange.prototype, \"relativeUpperRange\", {\n        /** Relative upper range */\n        get: function () { return this._relativeUpperRange; },\n        set: function (val) {\n            if (val < this._relativeLowerRange || val > 1) {\n                throw Error(val + \" is not a valid number for relativeUpperRange\");\n            }\n            this._relativeUpperRange = val;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(DualRange.prototype, \"relativeMinSpan\", {\n        /** Relative minimum difference of the upper range and lower range */\n        get: function () { return this._relativeMinSpan; },\n        set: function (val) {\n            if (val < 0 || val > 1) {\n                throw Error(val + \" is not a valid number for relativeMinSpan\");\n            }\n            this._relativeMinSpan = val;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(DualRange.prototype, \"relativeStep\", {\n        /** Relative step */\n        get: function () { return this._relativeStep; },\n        set: function (val) {\n            if (val < 0 || val > 1) {\n                throw Error(val + \" is not a valid number for relativeStep\");\n            }\n            this._relativeStep = val;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(DualRange.prototype, \"lowerRange\", {\n        // The absolute values are synchronized with the relative values\n        /** Absolute lower range */\n        get: function () {\n            var absoluteSpan = this.upperBoundary - this.lowerBoundary;\n            return this.relativeLowerRange * absoluteSpan + this.lowerBoundary;\n        },\n        set: function (lower) {\n            var absoluteSpan = this.upperBoundary - this.lowerBoundary;\n            var relativeLowerRange = (lower - this.lowerBoundary) / absoluteSpan;\n            if (relativeLowerRange < 0 || relativeLowerRange > 1\n                || relativeLowerRange > this.relativeUpperRange) {\n                throw Error(lower + \" is not a valid number for lowerRange\");\n            }\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(DualRange.prototype, \"upperRange\", {\n        /** Absolute upper range */\n        get: function () {\n            var absoluteSpan = this.upperBoundary - this.lowerBoundary;\n            return this.relativeUpperRange * absoluteSpan + this.lowerBoundary;\n        },\n        set: function (upper) {\n            var absoluteSpan = this.upperBoundary - this.lowerBoundary;\n            var relativeUpperRange = (upper - this.lowerBoundary) / absoluteSpan;\n            if (relativeUpperRange < 0 || relativeUpperRange > 1\n                || relativeUpperRange < this.relativeLowerRange) {\n                throw Error(upper + \" is not a valid number for upperRange\");\n            }\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(DualRange.prototype, \"minSpan\", {\n        /** Absolute min span */\n        get: function () {\n            var absoluteSpan = this.upperBoundary - this.lowerBoundary;\n            return Math.abs(this.relativeMinSpan * absoluteSpan);\n        },\n        set: function (span) {\n            var absoluteSpan = this.upperBoundary - this.lowerBoundary;\n            var relativeMinSpan = Math.abs(span / absoluteSpan);\n            if (relativeMinSpan > 1) {\n                throw Error(span + \" is not a valid number for minSpan\");\n            }\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(DualRange.prototype, \"step\", {\n        /** Absolute step */\n        get: function () {\n            var absoluteSpan = this.upperBoundary - this.lowerBoundary;\n            return Math.abs(this.relativeStep * absoluteSpan);\n        },\n        set: function (val) {\n            var absoluteSpan = this.upperBoundary - this.lowerBoundary;\n            var relativeStep = Math.abs(val / absoluteSpan);\n            if (relativeStep > 1) {\n                throw Error(val + \" is not a valid number for step.\");\n            }\n        },\n        enumerable: true,\n        configurable: true\n    });\n    return DualRange;\n}());\nexports.default = DualRange;\n\n\n//# sourceURL=webpack://dual-range-bar/./src/DualRange.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar DualHRange_1 = __webpack_require__(/*! ./DualHRange */ \"./src/DualHRange.ts\");\nexports.DualHRange = DualHRange_1.default;\n// (function checkWhenImported(): void {\n//   // Check if the script is running on a browser environment\n//   if (typeof window === 'undefined')\n//     throw Error('Grid canvas only works on a browser.\\nPlease check out if your configuration is correct.');\n// })();\n// (window as any).GridCanvas = GridCanvas;\n// export default GridCanvas;\nwindow.DualHRange = DualHRange_1.default;\n\n\n//# sourceURL=webpack://dual-range-bar/./src/index.ts?");

/***/ })

/******/ });
});