import './layout.css';
import './default-style.css';
import def from './definitions';
import DualHRange from './DualHRange';
import DualVRange from './DualVRange';

let dualHranges = document.getElementsByClassName(def.hrangeClassName);
let dualVranges = document.getElementsByClassName(def.vrangeClassName);

window.addEventListener('load', (event) => {
    for(let i = 0; i < dualHranges.length; i++) { new DualHRange(dualHranges[i]); }
    for(let i = 0; i < dualVranges.length; i++) { new DualVRange(dualVranges[i]); }
});

var toExport = window.DualRangeBar = {
    getHorizontal   : DualHRange.getObject,
    getVertical     : DualVRange.getObject
}

export default toExport;
