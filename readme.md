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

Dual range bar provides multiple configuration options for specifying initial values and styling.

```javascript
const drbar = new DualHRangeBar('my-drbar-container', {
  minimizes: false, // Minimises the container when inactive
  size: 'default',  // Size of the dual range bar
  lowerBound: 0,    // Initial value for "lowerBound"
  upperBound: 1,    // Initial value for "upperBound"
  minSpan: 0.2,     // Initial value for "minSpan"
  maxSpan: 1,       // Initial value for "maxSpan"
  lower: 0,         // Initial value for "lower"
  upper: 1,         // Initial value for "upper"
  sliderColor: '#1E88A8', // Color of the slider
  sliderActive: '#08789b',// Slider color when active
  rangeColor: '#7DB9DE',  // Color of the range slider
  rangeActive: '#5da8d6', // Range slider color when active
  bgColor: '#aaaaaa44',   // Color of the background
})
```

When `minimizes` is `true`, the dual range bar will narrow to a thin line when the mouse pointer is out of the container.

There are four available `size`'s for dual range bar, `small`, `default`, `large` and `huge`.

Dual range bar does not validate the color specification strings, the strings will be written directly into the CSS. When the `sliderColor` and `rangeColor` are specified, `sliderActive` and `rangeActive` will NOT change accordingly, you may have to specify the two colors manually. If you need to generate the darkened colors programmatically, [chroma.js](https://gka.github.io/chroma.js/) is a good choice. 

## Events

The event interface is quite straight-forward. When data is updated at user input, an `update` event is emitted from the container element. The `DualRangeBar` instance inherits the container's `EventTarget` interface, so listening to the `DualRangeBar` instance works the same. The emitted event is a [`CustomEvent`](https://developer.mozilla.org/en/docs/Web/API/CustomEvent) object, with its `detail` property referring the `DualRangeBar` instance.

```javascript
drbar.addEventListener('update', (e) => {
  console.log(e.detail.lower, e.detail.upper)
})

// This works the same
document.getElementById('my-drbar-container').addEventListener('update', 
  (e) => { console.log(e.detail.lower, e.detail.upper) })
```

## Styling

Though styling in the configuration options of the constructor is recommended, it is also possible to add custom style sheets to achieve detailed control to the style.

To override the default styles, you can select the elements via the container's id. Eg., the container's id is `my-drbar-container`, to style the sliders, you need to query the `#my-drbar-container .drbar-slider` CSS selector. This will override the default style specification implemented using the selector `.drbar-container .drbar-slider`.

Most dimensions & colors are specified with [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), overriding these variables will make changes to the dimensions & colors.

```css
.drbar-container {
  /* Colors */
  --slider-color: #1E88A8;
  --range-color: #7DB9DE;
  --bg-color: #aaaaaa44;
  --slider-active: #08789b;
  --range-active: #5da8d6;
  /* Sizes */
  --slider-wh: 20px;
  --range-thick: 15px;
  --bg-thick: 10px;
  --mini-thick: 4px;
  --mini-ratio: calc(4/15);
}
```

Please refer to the [`src/style.css`](src/styles.css) when advanced styling is needed.

## Contributing

Pull requests are welcomed.
