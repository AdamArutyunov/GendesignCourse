import p5 from 'p5';

const container = document.querySelector('#lesson-2');

const sketch = p => {
  p.setup = () => {
    p.createCanvas(0, 0);
  };

  p.draw = () => {
    p.background('red');
    p.fill(255);
    p.rect(p.random(1), 1, 50, 18);
  };

  window.addEventListener('resize', _ => {
    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
  });
};
let myp5 = new p5(sketch, document.querySelector('.program li:nth-child(2)'));
