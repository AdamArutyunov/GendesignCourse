import p5 from 'p5';

const container = document.querySelector('#lesson-1');

const sketch = p => {
  p.setup = () => {
    p.createCanvas(0, 0);
  };

  p.draw = () => {
    p.background(100);
    p.fill(255);
    p.rect(0, 1, 50, 18);
  };

  window.addEventListener('resize', _ => {
    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
  });
};

let myp5 = new p5(sketch, 'lesson-1');
