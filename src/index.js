import './layout.css';
import './default-style.css';
import def from './definitions';
import DualHRange from './DualHRange';
import DualVRange from './DualVRange';

window.addEventListener('load', (event) => {
    let dualHranges = document.getElementsByClassName(def.hrangeClassName);
    let dualVranges = document.getElementsByClassName(def.vrangeClassName);
    for(let i = 0; i < dualHranges.length; i++) { new DualHRange(dualHranges[i]); }
    for(let i = 0; i < dualVranges.length; i++) { new DualVRange(dualVranges[i]); }
});

export var HRange = DualHRange;
export var VRange = DualVRange;
