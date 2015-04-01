(function() {
  var canvas = document.getElementsByClassName('js-main-screen')[0];
  var ctx = canvas.getContext('2d');
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  var radius = 5;
  var circleColor = 'red';
  var greyBorderColor = '#003300';
  var listener = new window.keypress.Listener();
  var isPositioning = false;
  var min_pixel_delta = 10;
  var default_bisection_line_color = '#000000';
  var default_bisection_stroke_style = [2,3];
  var isBackgroundOn = false;
  var default_background_image_element = document.getElementsByClassName('desktop-background')[0];

  var x, y;
  var prevMinX, prevMinY, prevMaxX, prevMaxY;

  function drawLine(x1, y1, x2, y2, lineColor, strokeStyle) {
    ctx.beginPath();

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    if (lineColor) {
      ctx.strokeStyle = lineColor;
    }

    if (strokeStyle) {
      ctx.setLineDash(strokeStyle);
    }

    ctx.stroke();
  }

  function drawVerticalBisection(xCoord) {
    drawLine(xCoord, 0, xCoord, canvas.height, default_bisection_line_color, default_bisection_stroke_style);
  }

  function drawHorizontalBisection(yCoord) {
    drawLine(0, yCoord, canvas.width, yCoord, default_bisection_line_color, default_bisection_stroke_style);
  }

  function drawBisections() {
    drawHorizontalBisection(prevMinY);
    drawHorizontalBisection(prevMaxY);

    drawVerticalBisection(prevMinX);
    drawVerticalBisection(prevMaxX);
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawCircle(posX, posY, borderColor) {
    ctx.beginPath();
    ctx.arc(posX, posY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = circleColor;
    ctx.fill();
    if (borderColor) {
      ctx.lineWidth = 5;
      ctx.strokeStyle = borderColor;
      ctx.stroke();
    }
  }

  function drawBackground(imageElement) {
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
  }

  function drawScreenWithCircle(xCoord, yCoord) {
    x = xCoord;
    y = yCoord;
    drawScreen();
  }

  function drawScreen() {
    clearCanvas();
    if (isBackgroundOn) drawBackground(default_background_image_element);
    if (isPositioning) {
      drawBisections();
      drawCircle(x, y);
    }
  }

  function bisectLeft() {
    var nextX = (x - prevMinX) / 2 + prevMinX,
      deltaX = Math.max(Math.abs(nextX - x), min_pixel_delta);

    prevMinX = Math.min(x - deltaX, prevMinX);
    prevMaxX = x;

    x -= deltaX;
  }

  function bisectRight() {
    var nextX = (prevMaxX -  x) / 2 + x,
      deltaX = Math.max(Math.abs(nextX - x), min_pixel_delta);

    prevMaxX = Math.max(x + deltaX, prevMaxX);
    prevMinX = x;

    x += deltaX;
  }

  function bisectUp() {
    var nextY = (y - prevMinY) / 2 + prevMinY,
      deltaY = Math.max(Math.abs(nextY - y), min_pixel_delta);

    prevMinY = Math.min(y - deltaY, prevMinY);
    prevMaxY = y;
    
    y -= deltaY;
  }

  function bisectDown() {
    var nextY = (prevMaxY -  y) / 2 + y,
      deltaY = Math.max(Math.abs(nextY - y), min_pixel_delta);

    prevMaxY = Math.max(y + deltaY, prevMaxY);
    prevMinY = y;

    y += deltaY;
  }

  listener.simple_combo("t", function() {
    isBackgroundOn = !isBackgroundOn;

    drawScreen();
  });

  listener.simple_combo("c", function() {
    if (isPositioning) {
      isPositioning = false;
      clearCanvas();
      if (isBackgroundOn) drawBackground(default_background_image_element);
    } else {
      isPositioning = true;
      x = centerX;
      y = centerY;

      prevMinY = prevMinX = 0;
      prevMaxX = canvas.width;
      prevMaxY = canvas.height;
      drawScreenWithCircle(x, y);
    }
  });

  listener.simple_combo("j", function() {
    if (!isPositioning) return;

    bisectDown();

    drawScreen();
  });

  listener.simple_combo("k", function() {
    if (!isPositioning) return;

    bisectUp();

    drawScreen();
  });


  listener.simple_combo("l", function() {
    if (!isPositioning) return;

    bisectRight();

    drawScreen();
  });

  listener.simple_combo("h", function() {
    if (!isPositioning) return;

    bisectLeft();

    drawScreen();
  });


  listener.simple_combo("y", function () {
    if (!isPositioning) return;

    bisectLeft();
    bisectUp();

    drawScreen();
  });

  listener.simple_combo("u", function () {
    if (!isPositioning) return;

    bisectRight();
    bisectUp();

    drawScreen();
  });

  listener.simple_combo("n", function () {
    if (!isPositioning) return;

    bisectLeft();
    bisectDown();

    drawScreen();
  });

  listener.simple_combo("m", function () {
    if (!isPositioning) return;

    bisectRight();
    bisectDown();

    drawScreen();
  });
})();