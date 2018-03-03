let canvas = document.getElementById(`applicationCanvas`);
let context = canvas.getContext(`2d`);

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

//
// mouse object containing start and end coordinates and dragging status
//
let mouse = {
  start: {},
  end: {},
  dragging: false
};

let snapshot;

//
// Take snapshot of current canvas
//
let takeSnapshot = () => {
  snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
};

//
// Restore snapshot from [snapshot]
//
let restoreSnapshot = () => {
  context.putImageData(snapshot, 0, 0);
};

//
// @return random hex color(six number format)
//
let randomColor = () => {
  return `#${Math.random().toString(16).slice(-6)}`
};

//
// @param isFinalTriangle [boolean] True if triangle drawn is on mouse up event, false on mouse drag
//
let drawTriangle = (isFinalTriangle) => {
  context.beginPath();

  // Start drawing from middle of start and end x since it's a triangle
  context.moveTo((mouse.start.x + mouse.end.x) / 2, mouse.start.y / 2);

  // Draw a line till the bottom left of the virtual rectangle
  context.lineTo(mouse.start.x, mouse.end.y);

  // Draw base
  context.lineTo(mouse.end.x, mouse.end.y);

  if (isFinalTriangle) {
    // We don't need to complete the triangle's third side as it is handled automatically in case of fill
    context.fillStyle = randomColor();
    context.fill();
  } else {
    // draw third side also in case of stroke
    context.lineTo((mouse.start.x + mouse.end.x) / 2, mouse.start.y / 2)
    context.stroke();
  }
};

//
// mouse down event handler
//
canvas.onmousedown = (event) => {
  mouse.dragging = true;

  mouse.start = {
    x: event.pageX,
    y: event.pageY
  };

  takeSnapshot();
};

//
// Restore from current snapshot (in which mouse drag triangle is absent) and draw new triangle
//
let restoreAndDraw = function (x, y, isFinalTriangle) {
  mouse.end = {
    x: x,
    y: y
  };

  restoreSnapshot();
  drawTriangle(isFinalTriangle);
};

//
// mouse up event handler
//
canvas.onmouseup = (event) => {
  mouse.dragging = false;
  restoreAndDraw(event.pageX, event.pageY, true);
};

//
// mouse move event handler
//
canvas.onmousemove = (event) => {
  // drawHelperRules(event.pageX, event.pageY);

  // We don't want to draw if mouse status is not pressed (dragging)
  if (mouse.dragging) {
    restoreAndDraw(event.pageX, event.pageY, false);
  }
};
