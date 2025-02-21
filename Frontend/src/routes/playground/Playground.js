class RFElement {
  constructor(name, facets) {
    this.name = name
    this.facets = facets
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
    this.hovernode = null
    this.curaction = 0
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

  downSz(x, y) {
    return [ x, y ]
    let fixX = x / this.bounding.width * 300
    let fixY = y / this.bounding.height * 300
    return [ fixX, fixY ]
  }

  upPose(x, y) {
    let fixX = x * this.bounding.width
    let fixY = y * this.bounding.height
    return [ fixX, fixY ]
  }

  facetCenter(id) {
    const cp = this.upPose(this.nodes[id[0]].x, this.nodes[id[0]].y)
    const cfp = this.downSz(this.nodes[id[0]].facets[id[1]].x, this.nodes[id[0]].facets[id[1]].y)
    // const cfz = this.downSz(this.nodes[id[0]].facets[id[1]].w, this.nodes[id[0]].facets[id[1]].h)


    return [cp[0] + cfp[0], cp[1] + cfp[1]]
  }

  drawConnection(start, end) {
    this.ctx.beginPath()
    const c1 = this.facetCenter(start)
    const c2 = this.facetCenter(end)
    this.ctx.moveTo(c1[0], c1[1])
    this.ctx.lineTo(c2[0], c2[1])
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "green"; 
    this.ctx.stroke();
  }

  drawGraph() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    let kms = canvas.getBoundingClientRect()
    this.nodes.forEach((node, ni) => {
      node.facets.forEach((facet, fi) => {
        if (facet.link != null) {
          this.drawConnection([ni, fi], facet.link)
        }
      })
    })
    
    this.nodes.forEach((node, ni) => {
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      const cp = this.upPose(node.x, node.y)
      const cz = this.downSz(node.w, node.h)
      this.ctx.rect(cp[0] - cz[0] / 2, cp[1] - cz[0] / 2, cz[0], cz[1])
      if (this.hovernode != null && this.hovernode[0] == ni && this.hovernode[1] == 0) {
        this.ctx.fillStyle = "green"; 
      } else {
        this.ctx.fillStyle = "blue"; 
      }
      this.ctx.fill();
      this.ctx.strokeStyle = "white";
      this.ctx.stroke();
      this.ctx.beginPath();
      node.facets.forEach((facet, fi) => {
        this.ctx.beginPath();
        const cfp = this.downSz(facet.x, facet.y)
        const cfz = this.downSz(facet.w, facet.h)
        this.ctx.rect(
          cp[0] + cfp[0] - cfz[0] / 2, 
          cp[1] + cfp[1] - cfz[1] / 2, 
          cfz[0], cfz[1])
      if (this.hovernode != null && this.hovernode[0] == ni && this.hovernode[1] == fi + 1) {
          this.ctx.fillStyle = "white"; 
        } else {
          this.ctx.fillStyle = "red"; 
        }
        this.ctx.fill();
        this.ctx.strokeStyle = "white"; this.ctx.stroke();
      })
    })
  }

  addNode(f) {
    this.nodes.push(
      { 
        x: f[0], y: f[1], // Pos
        h: 100, w: 100,
        facets: [ 
          {x: -50, y: 0, h: 30, w: 100, iout: 0},
          {x: 50, y: 50, h: 30, w: 100, iout: 1},
          {x: 50, y: -50, h: 30, w: 100, iout: 1},
        ]
      })
    this.drawGraph();
  }

  getNodeAtPosition(f) {
    let cnode = null
    for (const [ni, node] of this.nodes.entries()) {
      const cz = this.downPose(node.w, node.h)
      for (const [fi, facet] of node.facets.entries()) {
        const cfp = this.downPose(facet.x, facet.y)
        const cfz = this.downPose(facet.w, facet.h)
        if (Math.abs(f[0] - node.x - cfp[0]) < cfz[0] / 2 &&
            Math.abs(f[1] - node.y - cfp[1]) < cfz[1] / 2) {
            cnode = fi + 1
            break
        }
      }
      if (cnode != null) {
        cnode = [ni, cnode]
        break
      } else if (Math.abs(f[0] - node.x) <= cz[0] / 2 && 
          Math.abs(f[1] - node.y) <= cz[1] / 2) {
        cnode = [ni, 0]
        break
      }
    }
    return cnode
  }

  mouseDown(x, y) {
    const f = this.downPose(x, y)
    const cnode = this.getNodeAtPosition(f)
    if (cnode != null && cnode[1] != 0) {
      this.curaction = 1
      console.log(`Setting curnode ${cnode[0]} ${cnode[1]}`)
      this.curnode = cnode
    } else if (cnode != null && cnode[1] == 0) {
      this.curaction = 2
      this.curnode = cnode
    }
    console.log(`Mdown`);
  }

  mouseUp(x, y) {
    const f = this.downPose(x, y)
    if (this.curaction == 0) {
      this.addNode(f)
    } else if (this.curaction == 1) {
      const cnode = this.getNodeAtPosition(f)
      if (this.curnode != null && this.curnode[1] != 0 && cnode != null && cnode[1] != 0) {
        cnode[1] -= 1
        if (this.nodes[this.curnode[0]].facets[this.curnode[1] - 1].iout == 0 && this.nodes[cnode[0]].facets[cnode[1]].iout == 1) {
          console.log("01")
          this.nodes[this.curnode[0]].facets[this.curnode[1] - 1].link = [cnode[0], cnode[1]]
        } else if (this.nodes[this.curnode[0]].facets[this.curnode[1] - 1].iout == 1 && this.nodes[cnode[0]].facets[cnode[1]].iout == 0) {
          console.log("10")
          this.nodes[cnode[0]].facets[cnode[1]].link = [this.curnode[0], this.curnode[1] - 1]
        }
      }
    }
    this.curaction = 0
    this.drawGraph()
    console.log(`Mup`);
  }

  mouseMove(x, y) {
    const f = this.downPose(x, y)
    const onode = this.hovernode
    const cnode = this.getNodeAtPosition(f)
    if (this.curaction == 0) {
      this.hovernode = cnode;
    } else if (this.curaction == 1) {

    } else if (this.curaction == 2) {
      this.nodes[this.curnode[0]].x = f[0]
      this.nodes[this.curnode[0]].y = f[1]
    }
    if (onode != cnode) { this.drawGraph() }
  }
}
