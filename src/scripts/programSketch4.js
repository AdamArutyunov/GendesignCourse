export const sk4 = (container, ff) => {
  return p => {
    p.setup = () => {
      p.createCanvas(10, 50);
      ff.resize();
    };

    p.draw = () => {
      if (!ff.inViewport) return;
      if (ff.mouseHover) {
        p.background('blue');
      } else {
        p.background('orange');
      }
      p.fill(255);
      p.rect(p.mouseX, p.mouseY + p.random(3), 50, 18);
    };
  };
};
