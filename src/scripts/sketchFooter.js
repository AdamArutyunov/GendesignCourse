const CURR_RND = Math.random();
const GRID_COUNT = 8;

export const skF = (container, ff) => {
  return p => {
    p.setup = () => {
      p.createCanvas(10, 50);
      resize();
    };

    p.windowResized = () => {
      resize();
    };

    function resize() {
      p.resizeCanvas(ff.container.offsetWidth, ff.container.offsetHeight);
    }

    function calculateWiggleVector(seed, frC) {
      const WIGGLE_SPEED = 5 * 0.001;
      const WIGGLE_RADIUS = 50;
      return [
        (0.5 - p.noise(seed * 200 + frC * WIGGLE_SPEED)) * WIGGLE_RADIUS,
        (0.5 - p.noise(seed + 700 + frC * WIGGLE_SPEED)) * WIGGLE_RADIUS,
      ];
    }

    p.draw = () => {
      let cellSize = [p.width / GRID_COUNT, p.height / GRID_COUNT];
      p.background('rgba(255, 255, 255, 0.2)');
      let wiggleArray = [];
      for (let i = 0; i < GRID_COUNT + 4; i++) {
        wiggleArray[i] = [];
        for (let j = 0; j < GRID_COUNT + 4; j++) {
          let basePoint = [0, 0];
          if (j % 2 === 1) {
            basePoint[0] = (i - 1) * cellSize[0];
          } else {
            basePoint[0] = (i - 1.5) * cellSize[0];
          }
          basePoint[1] = ((j - 1) * cellSize[1] * Math.sqrt(3)) / 2;

          let nodeWiggle = calculateWiggleVector(
            CURR_RND + i * j,
            p.frameCount
          );
          let wigglePoint = [
            basePoint[0] + nodeWiggle[0],
            basePoint[1] + nodeWiggle[1],
          ];
          p.strokeWeight(4);
          // point(...basePoint);
          p.point(...wigglePoint);
          wiggleArray[i][j] = wigglePoint;
          p.strokeWeight(1);
          p.fill(
            `hsla(${(360 + p.frameCount * 2 + i * j * 3) % 360}, 90%, 40%, 0.2)`
          );
          if (i > 0 && j > 0) {
            if (j % 2 === 0) {
              p.triangle(
                ...wigglePoint,
                ...wiggleArray[i - 1][j - 1],
                ...wiggleArray[i][j - 1]
              );

              p.triangle(
                ...wigglePoint,
                ...wiggleArray[i - 1][j - 1],
                ...wiggleArray[i - 1][j]
              );
            } else {
              p.triangle(
                ...wigglePoint,
                ...wiggleArray[i][j - 1],
                ...wiggleArray[i - 1][j]
              );

              p.triangle(
                ...wiggleArray[i - 1][j],
                ...wiggleArray[i - 1][j - 1],
                ...wiggleArray[i][j - 1]
              );
            }
          }
        }
      }
    };
  };
};
