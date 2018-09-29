# Dual range bar

A minimal scrolling bar/slider with two sliders that can be used for range scrolling/selection.

Demo: https://celestialphineas.github.io/dual-range-bar

## Features

Dual range bar is something alike the timeline control in Adobe Audition/Premiere. It allows you to control a range variable with dragging operations on sliders and mouse wheel scrolling.

It does not need any dependencies, and can work by simply using the `script` tag in your web page, while at the same time it fits for modern web development paradigm, providing modules (UMD) and a TypeScript declaration.

## Using Dual

### With the `script` tag only 

You may have a quick look at the source of the demo page: [index.html](index.html)

I will refer to the selected range part as "range" later, and the boundary of the selectable range is called "bound".

Import dual with a script declaration:

```html
<script src="dist/dual-range-bar.min.js"></script>
```

You will have a new horizontal dual range bar by simply:

```html
<div class="dual-hrange"></div>
```

A new horizontal range bar will be created right inside the div box.

Similarly, for a vertical dual range bar:

```html
<div class="dual-vrange"></div>
```

It's also possible to do this via scripting:

```html
<div id="horizontal-bar"></div>
<script>
var horizontalBar = dual.HRange.getObject('horizontal-bar');
</script>
```

This will automatically create an object and return it. Using the constructor is not encouraged.

If you want to use the property or call some methods of the dual range bar, you need some scripting:

```html
<div class="dual-hrange" id="dhr"></div>
<style>
#dhr {
  position: relative;
  height: 20px;
  width: 60%;
  left: 20%;
}
</style>
<script>
// Get the horizontal dual range bar object
var horizontalBar = dual.HRange.getObject('dhr');

// Get the lowerRange and upperRange of the current selection
document.getElementById('x1').innerHTML = horizontalBar.lowerRange.toFixed(2);
document.getElementById('x2').innerHTML = horizontalBar.upperRange.toFixed(2);

// Add callback to the value change
horizontalBar.addLowerRangeChangeCallback(function(val) {
  document.getElementById('x1').innerHTML = val.toFixed(2);
});
horizontalBar.addUpperRangeChangeCallback(function(val) {
  document.getElementById('x2').innerHTML = val.toFixed(2);
});
</script>
```

It is also possible to change the boundaries of the range bar. You can do the initialize with HTML or modify the value in JavaScript.

```html
<div class="dual-hrange" lower-bound="-2.5" upper-bound="1.2"></div>
```

```javascript
horizontalBar.lowerBound = -2.5;
horizontalBar.upperBound = 1.2;
```

You can not only get the values of current range, but setting them is also OK.

```javascript
// This will print the lower range of current status
console.log(horizontalBar.lowerRange);
// This will change the upper range of current status
horizontalBar.upperRange = 0.8;
```

### Using modules & TypeScript

See [test/test.ts](test/test.ts) for a detailed example.

You may not need to use the HTML attributes any more. Import the module and use JavaScript for everything.

### API

```typescript
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
    // Update the position of divs
    updatePositions: () => void;
    static getObject: (id: string) => DualRange | null;
}

export declare class HRange extends DualRange {}
export declare class VRange extends DualRange {}
```

## Stylizing

See [src/default-style.css](src/default-style.css) and customize the styles in your project.

## Capability

Any version of Internet Explorer is not supported. But it works fine on Edge and other modern browsers. It is not working well on touch screens when the page is scrolling.

## TODO

* A method to remove a bar
* Fix the known issues

## Contributions

Feel free to do anything with this stuff and raise any questions as an issue. The code base is messy, after all I write this to practice writing an NPM module myself.

Pull requests are welcome.
