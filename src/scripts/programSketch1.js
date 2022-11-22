export const sk1 = (container, ff) => {
  return p => {
    p.setup = () => {
      p.createCanvas(10, 50);
      ff.resize();
    };

    p.draw = () => {
      p.background(100);
      p.fill(255);
      p.rect(0, p.random(3), 50, 18);
    };
  };
};
