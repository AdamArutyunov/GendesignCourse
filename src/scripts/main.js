'use strict';

import p5 from 'p5';
import '../styles/main.scss';
import { skH } from './sketchHeader';
import { skF } from './sketchFooter';
import { skGrid } from './programSketchGrid';
import { skFlow } from './programSketchFlow';
import { skImg } from './programSketchImg';
import { skSubdiv } from './programSketchSubdiv';
// import { skPolar } from './programSketchPolar';
import { skCA } from './programSketchCA';
import './theory.js';

let sks = [];
window.colorShift = 0;

let skOpts = [
  { sel: '#sketchHeader', f: skH },
  { sel: '#lesson-grid', f: skGrid },
  { sel: '#lesson-ff', f: skFlow },
  { sel: '#lesson-sd', f: skSubdiv },
  { sel: '#lesson-img', f: skImg },
  { sel: '#lesson-ca', f: skCA },
  { sel: '#sketchFooter', f: skF },
];

function Sketch(skOpt) {
  let container = document.querySelector(skOpt.sel);
  let ff = { inViewport: false, mouseHover: false, container };
  ff.resize = () => {};
  let p = new p5(skOpt.f(container, ff), container);
  ff.getColor = val => {
    val -= val | 0;
    // let colors = [
    // 	"#1f244b",
    // 	"#654053",
    // 	"#a8605d",
    // 	"#d1a67e",
    // 	"#f6e79c",
    // 	"#b6cf8e",
    // 	"#60ae7b",
    // 	"#3c6b64",
    // ]
    let colors = [
      // "#73464c",
      '#ab5675',
      '#ee6a7c',
      '#ffa7a5',
      '#ffe07e',
      '#ffe7d6',
      '#72dcbb',
      '#34acba',
    ];
    colors.push(colors[0]);
    let iFloat = val * colors.length;
    // console.log('iFloat:', iFloat);
    let i1 = iFloat | 0;
    return p.color(colors[i1]);
    // console.log('i1:',i1)
    // let i2 = ((iFloat|0) + 1) % colors.length
    // console.log('i2:',i2)
    // let c1 = p.color(colors[i1])
    // let c2 = p.color(colors[i2])
    // console.log('iFloat%1:',iFloat%1)
    // return p.color(p.lerpColor(c1,c2,iFloat%1))
  };

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

setTimeout(() => {
  let videoIframe = document.createElement('iframe');

  videoIframe.src =
    'https://www.youtube.com/embed/QDrNo9XSoEw?autoplay=0&showinfo=0&showinfo=0&avatar=0&modestbranding=1';
  videoIframe.title = 'YouTube video player';
  videoIframe.frameborder = 0;
  videoIframe.allow =
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  videoIframe.allowfullscreen = true;

  document
    .querySelector('.video-placeholder')
    .querySelector('.video')
    .appendChild(videoIframe);
}, 100);

document.querySelectorAll('.dotted').forEach(el => {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(el.href.split('/').at(-1));
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

function generateExponentialInterpolator(startY, endY, xRange, b) {
  const xValues = Array.from(
    { length: 1000 },
    (_, i) => (i / 999) * (xRange[1] - xRange[0]) + xRange[0]
  );
  const a = startY;
  const c = 0;
  const yValues = xValues.map(x => a * Math.exp(b * x) + c);
  const yRange = endY - startY;
  return function exponentialInterpolator(x) {
    const t = (x - xRange[0]) / (xRange[1] - xRange[0]);
    const y =
      a +
      (yRange * (Math.exp(b * (t * (xRange[1] - xRange[0]))) - 1)) /
        (Math.exp(b * (xRange[1] - xRange[0])) - 1);
    return y;
  };
}

function updatePrice() {
  const startDate = new Date('01 May 2023 09:00 UTC+0');
  const endDate = new Date('15 May 2023 14:00 UTC+0');

  const startDays = 0;
  const endDays = (endDate - startDate) / 1000 / 86400;

  let date = new Date();
  let currentDays =
    (Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    ) -
      startDate) /
    1000 /
    86400;

  if (currentDays > endDays) return setPrice('(Запись окончена)');

  const startPrice = 9500;
  const endPrice = 16000;

  const gen = generateExponentialInterpolator(
    startPrice,
    endPrice,
    [startDays, endDays],
    0.1
  );

  let price = gen(currentDays);
  price = Math.floor(price / 10) * 10;

  let fPrice = String(price);
  if (price >= 10000) {
    fPrice = fPrice.slice(0, -3) + ' ' + fPrice.slice(-3);
  }
  fPrice += ' ₽';

  setPrice(fPrice);
}

function setPrice(formattedPrice) {
  document.querySelectorAll('.dynamic-price').forEach(el => {
    el.innerText = formattedPrice;
  });
}

updatePrice();
setInterval(updatePrice, 1000);
