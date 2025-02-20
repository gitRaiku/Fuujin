class RFElement {
  constructor(name) {
    this.name = name
    this.cursample = 0.0
    this.input = 0.0
    this.output = 0.0
    this.nextElem = null
  }

  update() {}
}

class AudioReader extends RFElement {
  constructor(name) { super(name) }

  update() {

  }
}

class DcOffset extends RFElement {
  constructor(name, offset) { super(name); this.offset = offset }

  update() {
    this.output = this.input + this.offset
  }
}

export class Playground {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d");
    this.nodes = []
    this.draggingNode = null
  }

  updateBounds(w, h) {
    this.bounding = canvas.getBoundingClientRect()
    this.canvas.width = this.bounding.width
    this.canvas.height = this.bounding.height
  }

  downPose(x, y) {
    let fixX = x / this.bounding.width
    let fixY = y / this.bounding.height
    return [ fixX, fixY ]
  }

  upPose(x, y) {
    let fixX = x * this.bounding.width
    let fixY = y * this.bounding.height
    return [ fixX, fixY ]
  }

  drawGraph() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges first
    /*
    this.edges.forEach(({ node1, node2 }) => {
      this.ctx.beginPath();
      this.ctx.moveTo(node1.x, node1.y);
      this.ctx.lineTo(node2.x, node2.y);
      this.ctx.strokeStyle = "white";
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    });
    */

    let kms = canvas.getBoundingClientRect()
    // Draw nodes on top
    this.nodes.forEach(node => {
      this.ctx.beginPath();
      const cp = this.upPose(node.x, node.y)
      this.ctx.arc(cp[0], cp[1], node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = "blue";
      this.ctx.fill();
      this.ctx.strokeStyle = "white";
      this.ctx.stroke();
    });
  }

  addNode(x, y) {
    const f = this.downPose(x, y)
    this.nodes.push({ x: f[0], y: f[1], radius: 10 });
    this.drawGraph();
  }

  getNodeAtPosition(x, y) {
    return this.nodes.find(node => {
      return Math.hypot(node.x - x, node.y - y) < node.radius;
    });
  }

  onClick(x, y) {
    console.log(`Clicked`);
  }

  mouseDown(x, y) {
    console.log(`Mdown`);
  }

  mouseUp(x, y) {
    console.log(`Mup`);
  }

  mouseMove(x, y) {
    console.log(`Mmove`);
  }
}
