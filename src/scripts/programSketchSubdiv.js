export const skSubdiv = (container, ff) => {
  return p => {
    let squares = [];
    let i = 0;
    let inViewportPrev;

    let resize = () => {
      p.resizeCanvas(ff.container.offsetWidth, ff.container.offsetHeight);
      squares = [];
      squares.push([
        0,
        0,
        container.offsetWidth,
        container.offsetHeight,
        false /*not done*/,
      ]);
      subdiv();
      p.loop();
      p.background(200);
    };

    p.setup = () => {
      p.createCanvas(0, 0);
      p.noStroke();
      resize();
    };

    p.windowResized = () => {
      resize();
    };

    function subdiv() {
      // p.randomSeed(Math.random()*9999)
      for (let i = 0; i < 11; i++) {
        let newSquares = [];
        for (let s of squares) {
          if (s[4] == false /*not done*/ && (p.random() < 0.7 || i < 4)) {
            if (s[2] > s[3]) {
              // horiz
              newSquares.push([s[0], s[1], s[2] / 2, s[3], false /*not done*/]);
              newSquares.push([
                s[0] + s[2] / 2,
                s[1],
                s[2] / 2,
                s[3],
                false /*not done*/,
              ]);
            } else {
              // vert
              newSquares.push([s[0], s[1], s[2], s[3] / 2, false /*not done*/]);
              newSquares.push([
                s[0],
                s[1] + s[3] / 2,
                s[2],
                s[3] / 2,
                false /*not done*/,
              ]);
            }
          } else {
            newSquares.push([s[0], s[1], s[2], s[3], true /*done*/]);
          }
        }
        squares = newSquares;
      }
    }

    p.draw = () => {
      p.randomSeed(100);
      // p.background('red')
      let t = p.frameCount;
      // p.circle(100,100,100 + p.sin(10+t))
      if (inViewportPrev === false && ff.inViewport === true) {
        resize();
      }
      for (let i = 0; i < squares.length; i++) {
        let s = squares[i];
        let randomColor = p.random(200, 255);
        p.fill(randomColor);
        let x = s[0];
        let y = s[1];
        let offset = 100 * Math.sin(t * 0.005 + i) ** 9001;
        if (p.random() < 0.5) {
          x += offset;
        } else {
          y += offset;
        }
        let w = s[2];
        let h = s[3];
        p.rect(x, y, w, h);
      }

      inViewportPrev = ff.inViewport;
    };
  };
};
