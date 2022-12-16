export const skFlow = (container, ff) => {
  return p => {
    let circles;
    let frame = 0;

    p.setup = function() {
      p.createCanvas(400, 400);
      p.stroke(150);
      p.noFill();

      resize();
    };
    p.windowResized = () => {
      resize();
    };

    function resize() {
      p.resizeCanvas(ff.container.offsetWidth, ff.container.offsetHeight);
      p.background('white');
      circles = [];

      for (let i = 0; i < 70; i++) {
        p.colorMode(p.HSL);
        // let randomColor = [(p.random() * 50 + colorShift) % 360, 100, 60];
        // let randomColor = ff.getColor(0.5)
        // console.log('randomColor:',randomColor)
        circles.push([...getRandomPixel(), 0, 100]);
      }
    }

    function getVector(x, y) {
      let k = 2;
      let s = 20;

      let dx = ((p.noise(x / s, y / s, 0) - 0.5) * k) / 2;
      let dy = (p.noise(x / s, y / s, 1) - 1) * k * 1.5;
      return [dx, dy];
    }

    function getRandomPixel() {
      let [x, y] = [p.random(p.width), p.height + 10];
      return [x, y];
    }

    p.draw = () => {
      if (!ff.inViewport) return;

      p.push();
      p.colorMode(p.RGB);
      p.background(255, 1.5);

      p.pop();

      if (true || ff.mouseHover || frame < 300) {
        p.noStroke();

        for (let c of circles) {
          // if (c[3] <= 0) return;

          p.fill(c[2]);
          p.circle(c[0], c[1], 20);

          let vector = getVector(c[0], c[1]);

          let randomColor = [
            (p.noise(c[0] / 200, c[1] / 200) * 50 + colorShift) % 360,
            100,
            60,
          ];

          c[2] = randomColor;

          if (p.random() < 0.005) {
            [c[0], c[1]] = getRandomPixel();
          }

          c[0] += vector[0];
          c[1] += vector[1];
          c[3] -= 0.5;
        }
        frame++;
      }
    };
  };
};
