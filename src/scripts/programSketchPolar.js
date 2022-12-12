export const skPolar = (container, ff) => {
  return p => {
    let frame = 0;
    function myCircle(cx, cy, diameter) {
      let r = diameter / 2;

      let angleStep = (0.02 * 2 * p.PI) / p.floor(r);

      for (let angle = 0; angle < 2 * p.PI; angle += angleStep) {
        let rCurrent = r + p.noise(angle * 0.4, frame / 200) ** 2 * p.height;
        let x = cx + p.sin(angle) * rCurrent;
        let y = cy + p.cos(angle) * rCurrent;
        p.point(x, y);
      }
    }

    p.setup = function() {
      p.createCanvas(700, 700);
      p.strokeWeight(0.2);
      p.stroke('silver');
      ff.resize();
      reset();
    };
    p.windowResized = () => {
      reset();
    };

    function reset() {
      p.background(255);
    }
    p.draw = function() {
      if (!ff.inViewport) return;
      if (ff.mouseHover || frame < 200) {
        myCircle(p.width / 2, p.height / 2, 200);
        frame++;
      }
    };
  };
};
