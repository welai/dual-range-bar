# Dual range bar

A minimal scrolling bar with two sliders that can be used for range scrolling/selection.

Demo: https://welai.github.io/dual-range-bar

## Features

Dual range bar is something alike the timeline control in Adobe Audition/Premiere. It allows you to control a range variable via dragging operations on sliders and mouse wheel scrolling. The primary design purpose is an alternative scrollbar rather than a value input, though it can be used in both scenarios.

Dual range bar does not need any dependencies, and can work well by simply referring the script with a `<script/>` tag in your webpage, while at the same time it fits for modern web development paradigm, providing modules (UMD) and developed with TypeScript.

## Installing

### The old `<script/>` tag manner

You may have a quick look at the source of the demo page: [index.html](index.html)

Import dual range bar with a script reference declaration:

```html
<script src="dist/dual-range-bar.min.js"></script>
```

The `src` path varies according to the location you make copy of the script.

### Using modules

```
$ npm install dual-range-bar
```

And in you JavaScript or TypeScript code:

```javascript
import { DualHRangeBar, DualVRangeBar } from 'dual-range-bar'
```

## Usage

### Declarative

You can create new dual range bars in a fully-declarative manner, but you will have no access to the `DualRangeBar` instance in JavaScript, which is usually unwanted. Anyway, initializing dual range bar with class names just works, and data properties are still accessible via [data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) of the container element.

```html
<div class="drbar-container"></div>
```

This by default creates a horizontal dual range bar. Note that, initializations based on class names are executed only once, at `window.onload`, and only `<div/>`'s with no child nodes will be initialized. 

To create a vertical dual range bar, adding a `drbar-vertical` class name to the container's class list.

```html
<div class="drbar-container drbar-vertical"></div>
```

### Using script

```html
<div id="my-drbar-container"></div>
```

And in your JavaScript/TypeScript:

```javascript
const drbar = new DualHRangeBar('my-drbar-container')
```

Or, this will create a vertical dual range bar:

```javascript
const drbar = new DualVRangeBar('my-drbar-container')
```

## Accessing data

Data interface of dual range bar is simple. 

```javascript
console.log(drbar.lower, drbar.upper, drbar.lowerBound, drbar.upperBound)
```

`lower` property is the value represented by the left/top slider. `upper` property is the value represented by the right/bottom slider.

`lowerBound` is the minimum possible value of the ranges, i.e. the leftmost/topmost value on the bar. `upperBound` is the maximum possible value of the ranges, i.e. the rightmost/bottommost value on the bar. A `lowerBound` that is larger than the `upperBound` is allowed.

```javascript
console.log(drbar.minSpan, drbar.maxSpan)
```

`minSpan` is the minimum range span, and `maxSpan` is the maximum range span. Dual range bar will try to prevent the sliders from representing a range smaller than the `minSpan` or larger than the `maxSpan`. Here, the "span" is always `upper - lower`.

All of the properties mentioned above are mutable. But you have to ensure that you have made them correct, or unexpected behaviors may occur. Manual changes to the data properties does not emit any events.

When you have no access to the `DualRangeBar` instance, values are also accessible via [data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) of the container element.

```javascript
console.log(parseFloat(document.getElementById('my-drbar-container').dataset.lowerBound))
```

## Configuring

## Events

## Stylizing

## Contributing

Pull requests are welcomed.
