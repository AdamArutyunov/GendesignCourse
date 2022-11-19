import p5 from 'p5';

const container = document.querySelector('#lesson-6');

const sketch = p => {
  let squares = [];
  let i = 0;

  p.setup = () => {
    console.log('draw');
    p.createCanvas(0, 0);
    p.stroke(255);
    resize();
  };

  p.draw = () => {
    if (i > 8) {
      p.noLoop();
      return;
    }
    let newSquares = [];
    for (let s of squares) {
      if (p.random() < 0.8 || i < 2) {
        newSquares.push([s[0], s[1], s[2] / 2, s[3] / 2]);
        newSquares.push([s[0], s[1] + s[3] / 2, s[2] / 2, s[3] / 2]);
        newSquares.push([s[0] + s[2] / 2, s[1], s[2] / 2, s[3] / 2]);
        newSquares.push([s[0] + s[2] / 2, s[1] + s[3] / 2, s[2] / 2, s[3] / 2]);
      } else {
        let randomColor = p.random(200, 255);
        p.fill(randomColor);
        p.rect(...s);
      }
    }
    squares = newSquares;
    i++;
  };

  function resize() {
    console.log('resize');
    i = 0;
    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    squares = [];
    squares.push([0, 0, container.offsetWidth, container.offsetHeight]);
    p.loop();
  }
  window.addEventListener('resize', resize);
};
let myp5 = new p5(sketch, container);
