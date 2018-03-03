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

let drawHelperRules = (x, y) => {
  context.beginPath();
  context.moveTo(x, 0);
  context.lineTo(x, window.innerHeight);
  context.stroke();
};

let takeSnapshot = () => {
  snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
};

let restoreSnapshot = () => {
  context.putImageData(snapshot, 0, 0);
};

let drawTriangle = () => {
  context.beginPath();

  // Start drawing from middle of start and end x since it's a triangle
  context.moveTo((mouse.start.x + mouse.end.x) / 2, mouse.start.y / 2);

  // Draw a line till the bottom left of the virtual rectangle
  context.lineTo(mouse.start.x, mouse.end.y);

  // Draw base
  context.lineTo(mouse.end.x, mouse.end.y);

  // We don't need to complete the triangle's third side as it is handled automatically
  context.fill();
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

let restoreAndDraw = function (x, y) {
  mouse.end = {
    x: x,
    y: y
  };

  restoreSnapshot();
  drawTriangle();
};

//
// mouse up event handler
//
canvas.onmouseup = (event) => {
  mouse.dragging = false;
  restoreAndDraw(event.pageX, event.pageY);
};

//
// mouse move event handler
//
canvas.onmousemove = (event) => {
  // drawHelperRules(event.pageX, event.pageY);

  // We don't want to draw if mouse status is not pressed (dragging)
  if (mouse.dragging) {
    restoreAndDraw(event.pageX, event.pageY);
  }
};
