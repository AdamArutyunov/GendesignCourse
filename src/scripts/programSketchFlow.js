export const skFlow = (container, ff) => {
  return p => {
    let circles;
    let frame = 0;

    p.setup = function() {
      p.createCanvas(400, 400);
      p.stroke(150);
      p.noFill();

      ff.resize();
      reset();
    };
    p.windowResized = () => {
      reset();
    };

    function reset() {
      circles = [];
      p.background('white');

      for (let i = 0; i < 100; i++) {
        p.colorMode(p.HSL);
        let randomColor = [(p.random() * 50 + colorShift) % 360, 100, 60];
        circles.push([...getRandomPixel(), randomColor, 100]);
      }
    }

    function getVector(x, y) {
      let k = 2;
      let s = 20;

      let dx = ((p.noise(x / s, y / s, 0) - 0.5) * k) / 2;
      let dy = (p.noise(x / s, y / s, 1) - 1) * k;
      return [dx, dy];
    }

    function getRandomPixel() {
      let [x, y] = [p.random(p.width), p.height + 10];
      return [x, y];
    }

    p.draw = () => {
      p.push();
      p.colorMode(p.RGB);
      p.background(255, 1);

      p.pop();

      if (!ff.inViewport) return;
      if (true || ff.mouseHover || frame < 300) {
        p.noStroke();

        for (let c of circles) {
          // if (c[3] <= 0) return;

          p.fill(c[2]);
          p.circle(c[0], c[1], 15);

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
