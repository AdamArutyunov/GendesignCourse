export const skImg = (container, ff) => {
  return p => {
    let frame = 0;
    let N, M;
    let rowsNum;
    let colsNum;
    let stepX, stepY, padding;

    let img1, img2;
    p.preload = function() {
      img1 = p.loadImage('/images/teacher1.jpg');
      img2 = p.loadImage('/images/teacher2.jpg');
    };

    p.setup = function() {
      p.createCanvas(400, 400);
      p.rectMode(p.CENTER);
      p.noStroke();
      p.background(0);
      ff.resize();
      resize();
    };
    p.windowResized = () => {
      resize();
    };

    function resize() {
      p.resizeCanvas(ff.container.offsetWidth, ff.container.offsetHeight);
      p.background('darkgrey');
      N = p.floor(p.height / 30);
      M = p.floor(p.width / 30);
      rowsNum = p.round(p.height / 30);
      colsNum = p.round(p.width / 30);
      padding = 0;
      stepX = (p.width - padding * 2) / colsNum;
      stepY = (p.height - padding * 2) / rowsNum;
    }

    p.draw = () => {
      if (!ff.inViewport) return;
      if (true || ff.mouseHover || frame < 3) {
        // p.background('white');
        p.push();
        p.colorMode(p.HSL);
        let randomColor = [window.colorShift % 360, 100, 60, 100];
        p.tint(...randomColor);
        for (let j = 0; j < N; j++) {
          for (let i = 0; i < M; i++) {
            if (Math.random() < 0.98) continue;
            let img;
            if (p.random() < 0.5) {
              img = img1;
            } else {
              img = img2;
            }
            let cx = (p.width / M) * i;
            let cy = (p.height / N) * j;
            let cw = p.width / M;
            let ch = p.height / N;
            let ix = (img.width / M) * i;
            let iy = (img.height / N) * j;
            let iw = img.width / M;
            let ih = img.height / N;
            p.image(img, cx, cy, cw, ch, ix, iy, iw, ih);
          }
        }
        p.pop();
        // p.filter(p.GRAY);
        frame++;
      }
    };
  };
};
