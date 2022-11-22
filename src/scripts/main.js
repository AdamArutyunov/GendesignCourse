import p5 from 'p5';
import '../styles/main.scss';
import { sk1 } from './programSketch1';
// import './programSketch2';
// import './programSketch6';

let sks = [];

let skOpts = [{ sel: '#lesson-1', f: sk1 }, { sel: '#lesson-2', f: sk1 }];

function Sketch(skOpt) {
  let container = document.querySelector(skOpt.sel);
  let ff = {};
  ff.resize = () => {
    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
  };
  let p = new p5(skOpt.f(container, ff), container);
  window.addEventListener('resize', ff.resize);
}

for (let skOpt of skOpts) {
  let sk = new Sketch(skOpt);
  sks.push(sk);
}

console.log('sks:', sks);
