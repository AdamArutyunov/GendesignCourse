export const skGrid = (container, ff) => {
  return p => {
    let frame = 0;
    let rowsNum;
    let colsNum;
    let stepX, stepY, padding;

    p.setup = function() {
      p.createCanvas(400, 400);
      p.rectMode(p.CENTER);
      p.noStroke();
      resize();
      // p.frameRate(60);
    };
    p.windowResized = () => {
      resize();
    };

    function resize() {
      p.resizeCanvas(ff.container.offsetWidth, ff.container.offsetHeight);
      rowsNum = p.round(p.height / 30);
      colsNum = p.round(p.width / 30);
      padding = 0;

      stepX = (p.width - padding * 2) / colsNum;
      stepY = (p.height - padding * 2) / rowsNum;
    }

    function drawCircles() {
      p.colorMode(p.HSL);

      p.randomSeed(100);
      for (let xi = 0; xi < colsNum; xi++) {
        for (let yi = 0; yi < rowsNum; yi++) {
          if (Math.random() < 0.97) continue;

          let randomColor = [(p.random() * 50 + colorShift) % 360, 100, 60];

          let x = stepX * xi + padding + stepX / 2;
          let y = stepY * yi + padding + stepY / 2;

          p.fill(randomColor);
          p.circle(x, y, stepX * 2);
        }
      }

      p.colorMode(p.RGB);
    }

    p.draw = () => {
      window.colorShift += 0.7;

      if (!ff.inViewport) return;

      p.background(255, 8);
      if (!(frame % 3)) drawCircles();
      frame++;
    };
  };
};
