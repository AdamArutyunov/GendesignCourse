export const skSubdiv = (container, ff) => {
  return p => {
    function hash(a) {
      a = (a + 123) * 7654321;
      a ^= a << 13;
      a ^= a >>> 17;
      a ^= a << 5;
      return (a >>> 0) / 4294967296;
    }

    function grid(x, y, step, num) {
      let id = Math.floor(9999.99 + x * 99.9 - y * 999.9 + p.millis() / 100);
      // let randomColor = ff.getColor((colorShift / 360)+.5);
      //
      let lightness = (p.dist(p.width / 2, p.height / 2, x, y) / p.width) * 1;
      lightness -= p.frameCount / 200;
      lightness = lightness - p.floor(lightness);

      let randomColor = p.color([
        (p.random() * 100 + colorShift) % 360,
        100,
        lightness * 30 + 70,
      ]);
      randomColor.setAlpha(0.1);
      p.fill(randomColor);
      if (hash(id) > 0.5 || step > 150) {
        if (step < 10) {
          p.rect(x + step / 2, y + step / 2, step);
        } else {
          for (let a = 0; a < num; a += 1) {
            for (let b = 0; b < num; b += 1) {
              grid(x + (a * step) / num, y + (b * step) / num, step / num, num);
            }
          }
        }
      } else {
        if (hash(id) < 0.1) p.rect(x + step / 2, y + step / 2, step);
      }
    }

    let resize = () => {
      p.resizeCanvas(ff.container.offsetWidth, ff.container.offsetHeight);
    };

    p.windowResized = () => {
      resize();
    };

    p.setup = () => {
      p.createCanvas(400, 400);
      p.noStroke();
      p.rectMode(p.CENTER);
      p.colorMode(p.HSB);
      resize();
    };

    p.draw = () => {
      if (!ff.inViewport) return;
      // let randomColor = ff.getColor(colorShift / 360 );
      // randomColor.setAlpha(.2);
      // p.fill((colorShift) / 360, 100, 100, .2);
      // p.background(0,0,100,.001);
      let step = p.width;
      grid(0, 0, step, 2);
    };
  };
};
