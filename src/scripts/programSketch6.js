export const sk6 = (container, ff) => {
  return p => {
    let squares = [];
    let i = 0;

    let reset = () => {
      // console.log('resize');
      i = 0;
      squares = [];
      squares.push([0, 0, container.offsetWidth, container.offsetHeight]);
      p.loop();
    };

    p.setup = () => {
      // console.log('draw');
      p.createCanvas(100, 100);
      p.stroke(255);
      ff.resize();
      reset();
    };

    p.windowResized = () => {
      reset();
    };

    p.draw = () => {
      if (i > 8) {
        p.noLoop();
        return;
      } else {
        let newSquares = [];
        for (let s of squares) {
          if (p.random() < 0.8 || i < 2) {
            newSquares.push([s[0], s[1], s[2] / 2, s[3] / 2]);
            newSquares.push([s[0], s[1] + s[3] / 2, s[2] / 2, s[3] / 2]);
            newSquares.push([s[0] + s[2] / 2, s[1], s[2] / 2, s[3] / 2]);
            newSquares.push([
              s[0] + s[2] / 2,
              s[1] + s[3] / 2,
              s[2] / 2,
              s[3] / 2,
            ]);
          } else {
            let randomColor = p.random(200, 255);
            p.fill(randomColor);
            p.rect(...s);
          }
        }
        squares = newSquares;
        // console.log('squares:', squares);
        i++;
        // }
      }
    };
  };
};
