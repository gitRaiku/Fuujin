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
  draw() {}
}

class RFAudio extends RFElement {
  constructor(name, pos) { 
    super(name); 
    this.x = pos[0]
    this.y = pos[1]
    this.h = 100
    this.w = 150
    this.facets = [
      {x: 50, y: 0, h: 30, w: 30, iout: 1},
    ]
  }

  draw(pl, pos, size) {
    let col;
    if (this.focused == true) { col = "brown"; } else { col = "white"; }
    pl.drawSquircle(pl, pos, size, 2, col)
  }


  update() {
    this.facets[0].val = 1.0;
  }
}

class RFAdder extends RFElement {
  constructor(name, pos) { 
    super(name); 
    this.x = pos[0]
    this.y = pos[1]
    this.h = 100
    this.w = 150
    this.facets = [
      {x: -75, y: 0, h: 30, w: 30, iout: 0},
      {x: 0, y: -50, h: 30, w: 30, iout: 0},
      {x: 75, y: 0, h: 30, w: 30, iout: 1},
    ]
  }

  draw(pl, pos, size) {
    let col;
    if (this.focused == true) { col = "brown"; } else { col = "white"; }
    pl.drawSquircle(pl, pos, size, 2, col)
    pl.ctx.beginPath();
    pl.ctx.strokeStyle = col;
    pl.ctx.lineWidth = 2;
    const ll = pl.downSz(10, 10);
    const sl = pl.downSz(5, 10);
    const cl = pl.downSz(30, 10);
    pl.ctx.moveTo(pos[0] + sl[0] / 2        , pos[1] - sl[0] / 2        )
    pl.ctx.lineTo(pos[0] + sl[0] / 2 + ll[0], pos[1] - sl[0] / 2        )
    pl.ctx.lineTo(pos[0] + sl[0] / 2 + ll[0], pos[1] + sl[0] / 2        )
    pl.ctx.lineTo(pos[0] + sl[0] / 2        , pos[1] + sl[0] / 2        )
    pl.ctx.lineTo(pos[0] + sl[0] / 2        , pos[1] + sl[0] / 2 + ll[0])
    pl.ctx.lineTo(pos[0] - sl[0] / 2        , pos[1] + sl[0] / 2 + ll[0])
    pl.ctx.lineTo(pos[0] - sl[0] / 2        , pos[1] + sl[0] / 2        )
    pl.ctx.lineTo(pos[0] - sl[0] / 2 - ll[0], pos[1] + sl[0] / 2        )
    pl.ctx.lineTo(pos[0] - sl[0] / 2 - ll[0], pos[1] - sl[0] / 2        )
    pl.ctx.lineTo(pos[0] - sl[0] / 2        , pos[1] - sl[0] / 2        )
    pl.ctx.lineTo(pos[0] - sl[0] / 2        , pos[1] - sl[0] / 2 - ll[0])
    pl.ctx.lineTo(pos[0] + sl[0] / 2        , pos[1] - sl[0] / 2 - ll[0])
    pl.ctx.lineTo(pos[0] + sl[0] / 2        , pos[1] - sl[0] / 2        )
    pl.ctx.stroke()
    pl.ctx.beginPath();
    pl.ctx.arc(pos[0], pos[1], cl[0], 0, 2 * Math.PI)
    pl.ctx.stroke()
  }


  update() {
    this.facets[2].val = this.facets[0].val + this.facets[1].val
  }
}

class RFMult extends RFElement {
  constructor(name, pos) { 
    super(name); 
    this.x = pos[0]
    this.y = pos[1]
    this.h = 100
    this.w = 100
    this.facets = [
      {x: -50, y: 0, h: 30, w: 30, iout: 0},
      {x: 0, y: -50, h: 30, w: 30, iout: 0},
      {x: 50, y: 0, h: 30, w: 30, iout: 1},
    ]
  }

  draw(pl, pos, size) {
    let col;
    if (this.focused == true) { col = "brown"; } else { col = "white"; }
    pl.drawSquircle(pl, pos, size, 2, col)
    pl.ctx.beginPath();
    pl.ctx.strokeStyle = col;
    pl.ctx.lineWidth = 2;
    const ll = pl.downSz(10, 10);
    const sl = pl.downSz(5, 10);
    const cl = pl.downSz(30, 10);
    pl.ctx.moveTo(pos[0] + sl[0] / 2        , pos[1] - sl[0] / 2        )
    pl.ctx.lineTo(pos[0] + sl[0] / 2 + ll[0], pos[1] - sl[0] / 2        )
    pl.ctx.lineTo(pos[0] + sl[0] / 2 + ll[0], pos[1] + sl[0] / 2        )
    pl.ctx.lineTo(pos[0] + sl[0] / 2        , pos[1] + sl[0] / 2        )
    pl.ctx.lineTo(pos[0] + sl[0] / 2        , pos[1] + sl[0] / 2 + ll[0])
    pl.ctx.lineTo(pos[0] - sl[0] / 2        , pos[1] - sl[0] / 2        )
    pl.ctx.lineTo(pos[0] - sl[0] / 2        , pos[1] - sl[0] / 2 - ll[0])
    pl.ctx.lineTo(pos[0] + sl[0] / 2        , pos[1] - sl[0] / 2 - ll[0])
    pl.ctx.lineTo(pos[0] + sl[0] / 2        , pos[1] - sl[0] / 2        )
    pl.ctx.stroke()
    pl.ctx.beginPath();
    pl.ctx.arc(pos[0], pos[1], cl[0], 0, 2 * Math.PI)
    pl.ctx.stroke()
  }


  update() {
    this.facets[2].val = this.facets[0].val * this.facets[1].val
  }
}

class RFConst extends RFElement {
  constructor(name, pos) { 
    super(name); 
    this.x = pos[0]
    this.y = pos[1]
    this.h = 100
    this.w = 100
    this.facets = [
      {x: 0, y: 50, h: 30, w: 30, iout: 1},
    ]
  }

  draw(pl, pos, size) {
    let col;
    if (this.focused == true) { col = "brown"; } else { col = "white"; }
    pl.drawSquircle(pl, pos, size, 2, col)
    pl.ctx.beginPath();
    pl.ctx.strokeStyle = col;
    pl.ctx.lineWidth = 2;
    const ll = pl.downSz(10, 10);
    const sl = pl.downSz(5, 10);
    const cl = pl.downSz(30, 10);
    pl.ctx.moveTo(pos[0] + sl[0] / 2        , pos[1] - sl[0] / 2        )
    pl.ctx.lineTo(pos[0] + sl[0] / 2 + ll[0], pos[1] - sl[0] / 2        )
    pl.ctx.lineTo(pos[0] + sl[0] / 2 + ll[0], pos[1] + sl[0] / 2        )
    pl.ctx.lineTo(pos[0] + sl[0] / 2        , pos[1] + sl[0] / 2        )
    pl.ctx.lineTo(pos[0] + sl[0] / 2        , pos[1] - sl[0] / 2 - ll[0])
    pl.ctx.lineTo(pos[0] + sl[0] / 2        , pos[1] - sl[0] / 2        )
    pl.ctx.stroke()
    pl.ctx.beginPath();
    pl.ctx.arc(pos[0], pos[1], cl[0], 0, 2 * Math.PI)
    pl.ctx.stroke()
  }

  update() {
    this.facets[0].val = 1.0
  }
}

class RFAntenna extends RFElement {
  constructor(name, pos) { 
    super(name); 
    this.x = pos[0]
    this.y = pos[1]
    this.h = 100
    this.w = 100
    this.facets = [
      {x: -50, y: 0, h: 30, w: 30, iout: 0},
    ]
  }

  draw(pl, pos, size) {
    pl.ctx.beginPath();
    pl.ctx.lineWidth = 20;
    pl.ctx.strokeStyle = "blue";
    const ll = pl.downSz(10, 10);
    const sl = pl.downSz(5, 10);
    const cl = pl.downSz(30, 10);
    pl.ctx.moveTo(pos[0] + sl[0] / 2        , pos[1] - sl[0] / 2        )
    pl.ctx.lineTo(pos[0] + sl[0] / 2 + ll[0], pos[1] - sl[0] / 2        )
    pl.ctx.lineTo(pos[0] + sl[0] / 2 + ll[0], pos[1] + sl[0] / 2        )
    pl.ctx.stroke()
  }


  update() {}
}

class ContextMenu {
  
}

export class Playground {
  constructor(canvas, nodeButtons) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d");
    this.nodes = []
    this.hovernode = null
    this.curaction = 0
    this.nextNodeType = 0
    this.nodeButtons = nodeButtons
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

  drawLine(c1, c2, width, style) {
    this.ctx.beginPath()
    this.ctx.moveTo(c1[0], c1[1])
    this.ctx.lineTo(c2[0], c2[1])
    this.ctx.lineWidth = width
    this.ctx.strokeStyle = style
    this.ctx.stroke()
  }

  drawConnection(start, end) {
    const c1 = this.facetCenter(start)
    const c2 = this.facetCenter(end)
    this.drawLine(c1, c2, 3, "green")
  }

  drawSquircle(pl, pos, size, width, col) {
    pl.ctx.beginPath()
    pl.ctx.lineWidth = width;
    pl.ctx.strokeStyle = col;
    const arcLen = pl.downSz(20, 20);
    pl.ctx.arc(
      pos[0] - size[0] / 2 + arcLen[0],
      pos[1] - size[1] / 2 + arcLen[0],
      arcLen[0], Math.PI * 2 / 2, Math.PI * 3 / 2, 0)
    pl.ctx.arc(
      pos[0] + size[0] / 2 - arcLen[0],
      pos[1] - size[1] / 2 + arcLen[0],
      arcLen[0], Math.PI * 3 / 2, Math.PI * 4 / 2, 0)
    pl.ctx.arc(
      pos[0] + size[0] / 2 - arcLen[0],
      pos[1] + size[1] / 2 - arcLen[0],
      arcLen[0], Math.PI * 4 / 2, Math.PI * 5 / 2, 0)
    pl.ctx.arc(
      pos[0] - size[0] / 2 + arcLen[0],
      pos[1] + size[1] / 2 - arcLen[0],
      arcLen[0], Math.PI * 5 / 2, Math.PI * 6 / 2, 0)
    pl.ctx.moveTo(pos[0] - size[0] / 2            , pos[1] - size[1] / 2 + arcLen[0])
    pl.ctx.lineTo(pos[0] - size[0] / 2            , pos[1] + size[1] / 2 - arcLen[0])
    pl.ctx.stroke()
  }

  drawGraph() {
    //console.log(`date ${new Date().getTime()}`)
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
      node.draw(this, cp, cz)
      this.ctx.lineWidth = 1;
      this.ctx.beginPath()
      //this.ctx.drawImage(node.svg, cp[0] - cz[0] / 2, cp[1] - cz[0] / 2, cz[0], cz[1])
      // this.ctx.rect(cp[0] - cz[0] / 2, cp[1] - cz[0] / 2, cz[0], cz[1])
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
        } else if (this.hovernode2 != null && this.hovernode2[0] == ni && this.hovernode2[1] == fi + 1) {
          this.ctx.fillStyle = "purple"; 
        } else {
          if (this.nodes[ni].facets[fi].iout == 0) { 
            this.ctx.fillStyle = "red"; 
          } else {
            this.ctx.fillStyle = "magenta"; 
          }
        }
        this.ctx.fill();
        this.ctx.strokeStyle = "white"; this.ctx.stroke();
      })
    })
  }

  addNode(f) {
    switch (this.nextNodeType) {
      case 0:
        this.nodes.push(new RFAdder("Adder", f))
        break
      case 1:
        this.nodes.push(new RFMult("Mult", f))
        break
      case 2:
        this.nodes.push(new RFConst("Const", f))
        break
      case 3:
        this.nodes.push(new RFAudio("Audio", f))
        break
      case 4:
        this.nodes.push(new RFAntenna("Antenna", f))
        break
    }

    if (this.nodeButtons != null) {
      for (const [li, lnode] of this.nodeButtons.entries()) {
        lnode.classList.remove("buttonSelected")
      }
    }
    this.nextNodeType = 999
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

  clearFocus() {
    this.nodes.forEach(node => {
      node.focused = false
    })
  }

  mouseDown(x, y) {
    this.clearFocus()
    const f = this.downPose(x, y)
    const cnode = this.getNodeAtPosition(f)
    if (cnode != null && cnode[1] == 0) { this.nodes[cnode[0]].focused = true }
    this.drawGraph()
    if (cnode != null && cnode[1] != 0) {
      this.curaction = 1
      this.curnode = cnode
    } else if (cnode != null && cnode[1] == 0) {
      this.curaction = 2
      this.curnode = cnode
    }
  }

  gnode(n) {
    if (n == null || n[1] != 0) { return null }
    return this.nodes[n[0]]
  }

  gfacet(n) {
    if (n == null || n[1] == 0) { return null }
    return this.nodes[n[0]].facets[n[1] - 1]
  }

  mouseUp(x, y) {
    const f = this.downPose(x, y)
    if (this.curaction == 0) {
      if (this.nextNodeType != 999) {
        this.addNode(f)
      } else {
        const cnode = this.gnode(this.getNodeAtPosition(f))
        if (cnode != null) {
          cnode.contextMenu = true
        }
      }
    } else if (this.curaction == 1) {
      const cnode = this.getNodeAtPosition(f)
      this.hovernode2 = null
      if (this.curnode != null && this.curnode[1] != 0 && cnode != null && cnode[1] != 0 && this.curnode[0] != cnode[0]) {
        let inode = null, onode = null;
        if (this.nodes[this.curnode[0]].facets[this.curnode[1] - 1].iout == 0 && this.nodes[cnode[0]].facets[cnode[1] - 1].iout == 1) {
          inode = [this.curnode[0], this.curnode[1] - 1]
          onode = [cnode[0], cnode[1] - 1]
        } else if (this.nodes[this.curnode[0]].facets[this.curnode[1] - 1].iout == 1 && this.nodes[cnode[0]].facets[cnode[1] - 1].iout == 0) {
          inode = [cnode[0], cnode[1] - 1]
          onode = [this.curnode[0], this.curnode[1] - 1]
        }

        if (inode != null) {
          const oldInLink = this.nodes[inode[0]].facets[inode[1]].link
          const oldOutLink = this.nodes[onode[0]].facets[onode[1]].link
          if (oldInLink != null) { 
            if (this.nodes[oldInLink[0]].facets[oldInLink[1]].link == onode) {
              this.nodes[inode[0]].facets[inode[1]].link = null 
              this.nodes[onode[0]].facets[onode[1]].link = null
              return
            }
            this.nodes[oldInLink[0]].facets[oldInLink[1]].link = null 
          }
          if (oldOutLink != null) {
            this.nodes[oldOutLink[0]].facets[oldOutLink[1]].link = null 
          }
          this.nodes[onode[0]].facets[onode[1]].link = [inode[0], inode[1]] /// Output -> Input
          this.nodes[inode[0]].facets[inode[1]].link = [onode[0], onode[1]] /// Input <- Output
        }
      }
    } else if (this.curaction == 2) {
      this.selnode = this.hovernode
    }
    this.curaction = 0
    this.drawGraph()
  }

  mouseMove(x, y) {
    const f = this.downPose(x, y)
    const onode = this.hovernode
    const cnode = this.getNodeAtPosition(f)
    if (this.curaction == 0) {
      this.hovernode = cnode;
    } else if (this.curaction == 1) {
      this.hovernode2 = null;
      if (this.curnode != null && this.curnode[1] != 0 && cnode != null && cnode[1] != 0 && this.curnode[0] != cnode[0]) {
        if (this.nodes[this.curnode[0]].facets[this.curnode[1] - 1].iout == 0 && this.nodes[cnode[0]].facets[cnode[1] - 1].iout == 1) {
          this.hovernode2 = cnode;
        } else if (this.nodes[this.curnode[0]].facets[this.curnode[1] - 1].iout == 1 && this.nodes[cnode[0]].facets[cnode[1] - 1].iout == 0) {
          this.hovernode2 = cnode;
        }
      }
    } else if (this.curaction == 2) {
      if (
        Math.abs(this.nodes[this.curnode[0]].x - f[0]) > 0.002 ||
        Math.abs(this.nodes[this.curnode[0]].y - f[1]) > 0.002) {
        this.curaction = 3;
        this.nodes[this.curnode[0]].x = f[0]
        this.nodes[this.curnode[0]].y = f[1]
      }
    } else if (this.curaction == 3) {
        this.nodes[this.curnode[0]].x = f[0]
        this.nodes[this.curnode[0]].y = f[1]
    }
    if (
      this.curaction != 0 || 
      (onode != null && cnode != null && onode[0] != cnode[0] && onode[1] != cnode[1])) {
      this.drawGraph() 
    }

    if (this.curaction == 1) {
      const c1 = this.facetCenter([onode[0], onode[1] - 1])

      this.drawLine(c1, [x, y])
    }
  }
}
