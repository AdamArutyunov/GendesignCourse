import p5 from 'p5';

const sketch = p => {
  p.setup = () => {
    p.createCanvas(200, 200);
  };

  p.draw = () => {
    p.background(100);
    p.fill(255);
    p.rect(p.random(1), 1, 50, 18);
  };
};
let myp5 = new p5(sketch, document.querySelector('.program li:first-child'));
