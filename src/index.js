import './style.css';
import { dualHrangeClassName, dualVrangeClassName } from './definitions';
import { DualHRange, DualVRange } from './DualRange'

let dualHranges = document.getElementsByClassName(dualHrangeClassName);
let dualVranges = document.getElementsByClassName(dualVrangeClassName);

window.onload = () => {
    for(let i = 0; i < dualHranges.length; i++) {
        new DualHRange(dualHranges[i]);
    }
    for(let i = 0; i < dualVranges.length; i++) { new DualVRange(dualVranges[i]); }
}

export var a = 'a';
