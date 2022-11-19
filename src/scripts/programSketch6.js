import p5 from 'p5';

const container = document.querySelector('#lesson-6');

const sketch = p => {
  let squares = [];
  let i = 0;

  p.setup = () => {
    p.createCanvas(0, 0);
    p.noStroke();
  };

  p.draw = () => {
    i++;
    if (i > 10) p.noLoop();

    let newSquares = [];

    for (let s of squares) {
      let r = p.random();

      if (r < 0.5) {
        let randomColor = [
          p.random(0, 255),
          p.random(0, 255),
          p.random(0, 255),
        ];
        p.fill(...randomColor);
        p.rect(...s);
      } else {
        newSquares.push([s[0], s[1], s[2] / 2, s[3] / 2]);
        newSquares.push([s[0], s[1] + s[3] / 2, s[2] / 2, s[3] / 2]);
        newSquares.push([s[0] + s[2] / 2, s[1], s[2] / 2, s[3] / 2]);
        newSquares.push([s[0] + s[2] / 2, s[1] + s[3] / 2, s[2] / 2, s[3] / 2]);
      }
    }
    squares = newSquares;
    p.stroke(0);
    p.fill(0);
    p.circle(0, 0, 100);
  };

  window.addEventListener('resize', _ => {
    i = 0;
    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    squares = [];
    squares.push([0, 0, container.offsetWidth, container.offsetHeight]);
  });
};
let myp5 = new p5(sketch, 'lesson-6');
