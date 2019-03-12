import DualHRange from './DualHRange';

// (function checkWhenImported(): void {
//   // Check if the script is running on a browser environment
//   if (typeof window === 'undefined')
//     throw Error('Grid canvas only works on a browser.\nPlease check out if your configuration is correct.');
// })();

// (window as any).GridCanvas = GridCanvas;
// export default GridCanvas;

(window as any).DualHRange = DualHRange;

export { DualHRange };
