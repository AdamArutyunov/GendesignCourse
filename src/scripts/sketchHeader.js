let vadd = (a, b) => a.map((d, i) => d + b[i]);
let vsub = (a, b) => a.map((d, i) => d - b[i]);
let vmult = (a, s) => a.map(d => d * s);
let vnorm = a => {
  let l = Math.sqrt(a.reduce((s, d) => s + d * d));
  return a.map(d => d / l);
};
let vcross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

export const skH = (container, ff) => {
  return p => {
    p.setup = () => {
      p.createCanvas(10, 50);
      p.stroke(200);
      p.colorMode(p.HSL);
      p.strokeWeight(0.5);
      p.noFill();
      resize();
    };

    p.windowResized = () => {
      resize();
    };

    function resize() {
      p.resizeCanvas(ff.container.offsetWidth, ff.container.offsetHeight);
    }

    p.draw = () => {
      if (!ff.inViewport) return;
      p.background('white');
      let t = (p.millis() / 1000) * 0.1;
      p.beginShape();
      for (let i = 0; i < 50; i++) {
        let nx = p.noise(t + i / 100, i) - 0.5;
        let ny = p.noise(t + i / 100 + 0.5, 1000 + i) - 0.5;
        let xy = [nx, ny];
        xy = vmult(xy, 2);
        xy = vadd(xy, [0.5, 0.5]);
        xy[0] *= p.width;
        xy[1] *= p.height;
        p.curveVertex(...xy);
      }
      p.endShape(p.CLOSE);
    };
  };
};
