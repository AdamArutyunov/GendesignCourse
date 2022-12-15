export const skImg = (container, ff) => {
  return p => {
    let img, cardWidth, cardHeight, imageTop, cards;
    let cardIndex, cardX, cardY, vx, vy, ay;

    p.preload = function() {
      img = p.loadImage('/images/spritesheet.png');
      cardWidth = 54;
      cardHeight = 72;
      imageTop = cardHeight;
      p.colorMode(p.HSL);
    };

    function fillCards() {
      cards = [...Array(52).keys()];
      cards = cards.sort((a, b) => 0.5 - Math.random());
    }

    p.setup = function() {
      p.createCanvas(700, 700);
      p.background(255);
      cardIndex = undefined;
      cardX = cardY = undefined;
      vx = undefined;
      ay = 1;

      p.noStroke();

      fillCards();

      resize();
    };

    p.windowResized = () => {
      resize();
    };

    function resize() {
      p.resizeCanvas(ff.container.offsetWidth, ff.container.offsetHeight);
      p.background('white');
    }

    function drawCard(n, x, y) {
      p.colorMode(p.HSL);

      let column = n % 13;
      let row = p.floor(n / 13);

      let spriteX = column * (cardWidth + 1);
      let spriteY = row * (cardHeight + 1) + 1;

      p.image(
        img,
        x,
        y,
        cardWidth * 1.5,
        cardHeight * 1.5,
        spriteX,
        imageTop + spriteY,
        cardWidth,
        cardHeight
      );

      let randomColor = [(colorShift + 20) % 360, 100, 50, 0.5];
      p.fill(randomColor);
      p.rect(x, y, cardWidth * 1.5, cardHeight * 1.5, 7);
    }

    p.draw = () => {
      if (!ff.inViewport) return;

      if (true || ff.mouseHover || frame < 3) {
        if (cardX === undefined || cardY === undefined) {
          cardX = p.random(p.width / 2 - 100, p.width / 2 + 100);
          cardY = p.random(-50, 50);
          vx = p.random(2, 12) * Math.sign(p.random(-1, 1));
          vy = p.random(-7, 16);
          cardIndex = cards.pop();
        }

        vy += ay;

        cardX += vx;
        cardY += vy;

        if (cardY + cardHeight > p.height) {
          cardY = p.height - cardHeight;
          vy = -vy / 1.25;
        }

        if (
          (vx > 0 && cardX > p.width) ||
          (vx < 0 && cardX + cardWidth * 1.5 < 0)
        ) {
          //console.log(vx, cardX, cardWidth * 1.5, width)
          cardX = cardY = undefined;
          vx = undefined;

          if (!cards.length) {
            fillCards();
          }

          cardIndex = cards.pop();

          return;
        }

        let randomColor = [colorShift % 360, 100, 60, 0.006];
        p.background(randomColor);
        drawCard(cardIndex, cardX, cardY);
      }
    };
  };
};
