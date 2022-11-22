export const sk6 = (container, ff) => {
  return p => {
    let squares = [];
    let i = 0;
    let inViewportPrev;

    let reset = () => {
      i = 0;
      squares = [];
      squares.push([0, 0, container.offsetWidth, container.offsetHeight]);
      p.loop();
      p.background(200);
    };

    p.setup = () => {
      p.createCanvas(0, 0);
      p.noStroke();
      ff.resize();
      reset();
    };

    p.windowResized = () => {
      reset();
    };

    p.draw = () => {
      if (inViewportPrev === false && ff.inViewport === true) {
        reset();
      }
      inViewportPrev = ff.inViewport;
      if (i > 12) {
        return;
      } else {
        let newSquares = [];
        for (let s of squares) {
          if (p.random() < 0.8 || i < 4) {
            if (s[2] > s[3]) {
              // horiz
              newSquares.push([s[0], s[1], s[2] / 2, s[3]]);
              newSquares.push([s[0] + s[2] / 2, s[1], s[2] / 2, s[3]]);
            } else {
              // vert
              newSquares.push([s[0], s[1], s[2], s[3] / 2]);
              newSquares.push([s[0], s[1] + s[3] / 2, s[2], s[3] / 2]);
            }
          } else {
            let randomColor = p.random(200, 255);
            p.fill(randomColor);
            p.rect(...s);
          }
        }
        squares = newSquares;
        i++;
      }
    };
  };
};
