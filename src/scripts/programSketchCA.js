export const skCA = (container, ff) => {
  return p => {
    let cells = [];
    let cell_width;
    let size;

    p.setup = () => {
      p.randomSeed(1);
      p.frameRate(100);
      p.colorMode(p.HSB);
      p.createCanvas(10, 10);
      p.noStroke();
      resize();
    };

    p.windowResized = () => {
      resize();
    };

    function resize() {
      p.resizeCanvas(ff.container.offsetWidth, ff.container.offsetHeight);
      p.background('red');
      cell_width = 10;
      size = [(p.width / cell_width + 1) | 0, (p.height / cell_width + 1) | 0];
      cells = [];
      for (let i = 0; i < size[0]; i++) {
        cells.push([]);
        for (let j = 0; j < size[1]; j++) {
          if (i == 0 || j == 0) {
            cells[i].push(0);
          } else {
            cells[i].push(p.floor(p.random(0, 2) * 255));
          }
          //else{cells[i].push(0)}
        }
      }
    }

    p.draw = () => {
      // draw
      p.background(window.colorShift % 360, 100, 100, 0.01);
      for (let i = 0; i < size[0]; i++) {
        for (let j = 0; j < size[1]; j++) {
          let hue = window.colorShift + p.noise(i, j) * 5 - 2;
          hue %= 360;
          if (cells[i][j] < 240) continue;
          if (cells[i][j] == 254) p.fill(hue, 80, 100);
          else p.fill(hue, 100, 100);
          p.rect(i * cell_width, j * cell_width, cell_width, cell_width);
        }
      }

      // process
      let mod = (x, m) => (x + m) % m;
      let cells_new = JSON.parse(JSON.stringify(cells));
      for (let i = 0; i < size[0]; i++) {
        for (let j = 0; j < size[1]; j++) {
          // считаем соседние клекти, в кторых ровно 255
          var near = 0;
          if (cells[mod(i - 1, size[0])][mod(j - 1, size[1])] >= 255) {
            near += 1;
          }
          if (cells[mod(i - 1, size[0])][mod(j, size[1])] >= 255) {
            near += 1;
          }
          if (cells[mod(i - 1, size[0])][mod(j + 1, size[1])] >= 255) {
            near += 1;
          }

          if (cells[mod(i, size[0])][mod(j - 1, size[1])] >= 255) {
            near += 1;
          }
          if (cells[mod(i, size[0])][mod(j + 1, size[1])] >= 255) {
            near += 1;
          }

          if (cells[mod(i + 1, size[0])][mod(j - 1, size[1])] >= 255) {
            near += 1;
          }
          if (cells[mod(i + 1, size[0])][mod(j, size[1])] >= 255) {
            near += 1;
          }
          if (cells[mod(i + 1, size[0])][mod(j + 1, size[1])] >= 255) {
            near += 1;
          }
          // остаётся мёртвой
          if (cells[i][j] < 255) {
            cells_new[i][j] -= 10;
          }
          // если  мало клеточек, умирает (254)
          if (cells[i][j] >= 255 && (near < 2 || near > 3)) {
            cells_new[i][j] = 254;
          }
          // рождается
          if (near == 3 || p.random() < 0.001) {
            cells_new[i][j] = 255;
          }
        }
      }
      cells = cells_new;
    };

    // let frame = 0;
    // let rowsNum;
    // let colsNum;
    // let stepX, stepY, padding;

    // p.setup = function() {
    //   p.createCanvas(400, 400);
    //   p.rectMode(p.CENTER);
    //   p.noStroke();
    //   resize();
    //   // p.frameRate(60);
    // };
    // p.windowResized = () => {
    //   resize();
    // };

    // function resize() {
    //   p.resizeCanvas(ff.container.offsetWidth, ff.container.offsetHeight);
    //   rowsNum = p.round(p.height / 30);
    //   colsNum = p.round(p.width / 30);
    //   padding = 0;

    //   stepX = (p.width - padding * 2) / colsNum;
    //   stepY = (p.height - padding * 2) / rowsNum;
    // }

    // function drawCircles() {
    //   p.colorMode(p.HSL);

    //   p.randomSeed(100);
    //   for (let xi = 0; xi < colsNum; xi++) {
    //     for (let yi = 0; yi < rowsNum; yi++) {
    //       if (Math.random() < 0.97) continue;

    //       let randomColor = [(p.random() * 50 + colorShift) % 360, 100, 60];

    //       let x = stepX * xi + padding + stepX / 2;
    //       let y = stepY * yi + padding + stepY / 2;

    //       p.fill(randomColor);
    //       p.circle(x, y, stepX * 2);
    //     }
    //   }

    //   p.colorMode(p.RGB);
    // }

    // p.draw = () => {
    //   window.colorShift += 0.7;

    //   if (!ff.inViewport) return;

    //   p.background(255, 8);
    //   if (!(frame % 3)) drawCircles();
    //   frame++;
    // };
  };
};
