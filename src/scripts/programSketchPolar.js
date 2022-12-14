export const skPolar = (container, ff) => {
  return p => {
    let frame = 0;
    function myCircle(cx, cy, diameter) {
      p.colorMode(p.HSL);
      let r = 3;

      let angleStep = (0.02 * 2 * p.PI) / p.floor(r * 2);
      let randomColor = [window.colorShift % 360, 100, 60];
      p.stroke(randomColor);
      p.fill(randomColor);

      for (let angle = 0; angle < 2 * p.PI; angle += angleStep) {
        let rCurrent =
          r + p.noise(angle * 0.4, frame / 100) ** 2 * p.height * 2;
        let x = cx + p.sin(angle) * rCurrent * 1.2;
        let y = cy + p.cos(angle) * rCurrent;
        p.circle(x, y, 4);
      }

      p.colorMode(p.RGB);
    }

    p.setup = function() {
      p.createCanvas(700, 700);
      p.strokeWeight(0.2);
      p.stroke('silver');
      resize();
    };
    p.windowResized = () => {
      resize();
    };

    function resize() {
      p.resizeCanvas(ff.container.offsetWidth, ff.container.offsetHeight);
      p.background(50);
    }
    p.draw = function() {
      if (!ff.inViewport) return;

      if (true || ff.mouseHover || frame < 200) {
        p.colorMode(p.RGB);
        p.background(50, 2);
        myCircle(p.width / 2, p.height / 2, 200);
        frame++;
      }
    };
  };
};
