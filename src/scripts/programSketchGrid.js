export const skGrid = (container, ff) => {
  return p => {
    let rowsNum;
    let colsNum;
    let stepX, stepY, padding;

    p.setup = function() {
      p.createCanvas(400, 400);
      p.rectMode(p.CENTER);
      p.noStroke();
      p.background(0);
      ff.resize();
      reset();
    };
    p.windowResized = () => {
      reset();
    };

    function reset() {
      rowsNum = p.round(p.height / 30);
      colsNum = p.round(p.width / 30);
      padding = 0;
      stepX = (p.width - padding * 2) / colsNum;
      stepY = (p.height - padding * 2) / rowsNum;
    }

    function drawCircles() {
      for (let xi = 0; xi < colsNum; xi++) {
        for (let yi = 0; yi < rowsNum; yi++) {
          if (p.random() < 0.7) continue;
          let x = stepX * xi + padding + stepX / 2;
          let y = stepY * yi + padding + stepY / 2;
          let style_ = p.random(['solid', 'blur']);
          p.fill(0, 20);
          p.circle(x, y, stepX * 2);
        }
      }
    }

    p.draw = () => {
      if (!ff.inViewport) return;
      if (ff.mouseHover || p.frameCount < 3) {
        p.background('white');
        drawCircles();
      }
    };
  };
};
