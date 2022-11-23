import p5 from 'p5';
import '../styles/main.scss';
import { skH } from './sketchHeader';
import { sk1 } from './programSketch1';
import { sk6 } from './programSketch6';

let sks = [];

let skOpts = [
  { sel: '#sketchHeader', f: skH },
  { sel: '#lesson-1', f: sk1 },
  { sel: '#lesson-6', f: sk6 },
];

function Sketch(skOpt) {
  let container = document.querySelector(skOpt.sel);
  let ff = { inViewport: false, mouseHover: false };
  ff.resize = () => {
    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
  };
  let p = new p5(skOpt.f(container, ff), container);
  window.addEventListener('resize', ff.resize);
  let scroll = e => {
    let rect = container.getBoundingClientRect();
    ff.inViewport = rect.top < window.innerHeight && rect.bottom > 0;
  };
  window.addEventListener('scroll', scroll);
  container.addEventListener('mouseover', _ => (ff.mouseHover = true));
  container.addEventListener('mouseout', _ => (ff.mouseHover = false));
  scroll();
}

for (let skOpt of skOpts) {
  let sk = new Sketch(skOpt);
  sks.push(sk);
}
