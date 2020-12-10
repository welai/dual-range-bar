import DualHRangeBar from './DualHRangeBar'
import DualVRangeBar from './DualVRangeBar'

window.addEventListener('load', () => {
  let dualRangeBars = document.getElementsByClassName('drbar-container')
  for (let i = 0; i < dualRangeBars.length; i++) {
    const bar = dualRangeBars.item(i)
    if (bar?.nodeName !== 'DIV') continue
    if (bar?.childElementCount > 0) continue
    if (bar?.classList.contains('drbar-vertical')) {
      new DualVRangeBar(bar as HTMLDivElement)
    } else {
      new DualHRangeBar(bar as HTMLDivElement)
    }
  }
});

(window as any).DualHRange = DualHRangeBar;
(window as any).DualVRange = DualVRangeBar;

export { DualHRangeBar, DualVRangeBar };
