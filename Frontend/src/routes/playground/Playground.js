import { PCMPlayer, AudioPlayer } from '/src/routes/playground/pcm-player.js';
import { KissFFT, KissFFTR, loadKissFFT } from '/src/routes/playground/KissFFTLoader.js';

const bgcol = "#1b1b1d"
const fgcol = "#e3e3e3"
const primcol = "#029919"
const seccol = "#43D051"
const ghostcol = "#242526"

export async function playgroundOnMount() { await loadKissFFT() }
class AudioPacket {
  constructor(type, data) {
    if (type == undefined) {
      console.error(`UNDEFINED TYPE ${type}`)
    }
    this.type = type
    this.freq = 10000
    if (data != undefined) {
      if ((type == 0 && data.length != 512) || (type == 1 && data.length != 514) || (type == 2 && data.length != 514)) {
        console.error(`INVALID LENGTH ${type} ${data.length}`)
      }
      this.arr = new Float32Array(data.length)
      this.arr.set(data)
    } else {
      if (type == 0) {
        this.arr = new Float32Array(512)
      } else if (type == 1 || type == 2) {
        this.arr = new Float32Array(514)
      }
    }
  }

  upconvert(freq) {
    if (this.type != 2) {
      this.setInterval(this.toFreq())
      this.type = 2
    }
    if (this.freq == undefined) {
      this.freq = freq
    } else {
      this.freq += freq
    }
  }

  mima() {
    let mi = 0
    let ma = 0
    for (let i = 0; i < 512; ++i) {
      if (this.arr[i] < mi) { mi = this.arr[i] }
      if (this.arr[i] > ma) { ma = this.arr[i] }
    }
    return [mi, ma]
  }

  toString() { return `AudioPacket {${this.type}:${this.arr.length}:${this.arr[2]}}` }

  freqToBin() { }

  static freqPacket(freq, amplitude = 1.0, offset = 0) {
    var f32 = new Float32Array(512)
    freq /= 44100 / 512
    for (var i = 0; i < 512; ++i) {
      f32[i] = Math.sin((i + offset) / 512 * 3.1415 * 2 * freq) * amplitude
    }
    const cp = new AudioPacket(0, f32)
    return cp
  }

  setInplace(p) {
    this.arr = p.arr
    this.type = p.type
    if (p.freq != undefined) {
      this.freq = p.freq
    } else {
      this.freq = 10000
    }
  }

  setFreq(freq, amp = 1.0, offset = 0.0) {
    if (this.type == 0) {
      console.error("Trying to set frequency on time packet!")
      return
    } else if (this.type == 1) {
      const fft = new KissFFTR(512)
      const cp = new AudioPacket(1, fft.forward(AudioPacket.freqPacket(freq, 1.0, 0.0).arr))
      this.setInplace(this.add(cp))
      fft.dispose()
    }
  }

  toCFreq() {
    if (this.type == 0) {
      return this.toFreq().toCFreq()
    } else if (this.type == 1) {
      this.freq = 10000
      this.type = 2
      return this
    } else {
      return this
    }
  }

  toFreq() {
    if (this.type == 0) {
      const fft = new KissFFTR(512)
      const cp = new AudioPacket(1, fft.forward(this.arr))
      fft.dispose()
      return cp
    } else if (this.type == 1) {
      return this
    } else if (this.type == 2) {
      const freqDif = this.freq - 10000
      const binSize = 44100 / 512 / 2
      if (Math.abs(freqDif) > 257 * binSize) {
        return new AudioPacket(1)
      } else {
        const binDist = Math.floor(freqDif / binSize)
        const f32 = new Float32Array(514)
        for (let i = 0; i < 257; ++i) {
          if (i + binDist < 0) { continue }
          if (i + binDist > 256) { continue }
          f32[i] = this.arr[i + binDist]
        }
        return new AudioPacket(1, f32)
      }
    }
  }

  toTime() {
    if (this.type == 0) {
      return this
    } else if (this.type == 1) {
      var fft = new KissFFTR(512)
      const fftinv = fft.inverse(this.arr) 
      const cp = new AudioPacket(0)
      for (let i = 0; i < 512; ++i) {
        cp.arr[i] = fftinv[i] / 512.0
      }
      fft.dispose()
      return cp
    } else if (this.type == 2) {
      return this.toFreq().toTime()
    }
  }

  add(p) {
    if (this.type == 2 || p.type == 2) { return new AudioPacket(0) }
    if (this.type == 0 && p.type == 1) {
      p.setInplace(p.toTime())
    } else if (this.type == 1 && p.type == 0) {
      this.setInplace(this.toTime())
    }
    for (let i = 0; i < 512; ++i) { this.arr[i] += p.arr[i] }
    return this
  }

  mult(p) {
    if (this.type == 2 || p.type == 2) { return new AudioPacket(0) }
    if (this.type == 1) { this.setInplace(this.toTime()) }
    if (p.type == 1) { p.setInplace(p.toTime()) }
    if (this.type == 0 && p.type == 0) {
      for (let i = 0; i < 512; ++i) { this.arr[i] *= p.arr[i] }
    }
    return this
  }
}

class RFElement {
  constructor(name, pos, pl) {
    this.name = name
    this.pl = pl
    this.nextElem = null
    this.contextOpen = false

    this.input = document.createElement('input')
    this.button = document.createElement('button')
    this.pl = pl
    this.id = pl.nextid
    pl.nextid++
    this.cstate = 0
  }

  isRunning() { return 1; }

  serialize() {}
  restoreState(data) {}
  static fromSerial(pl, data) {
    let node;
    console.log("Data", data)
    switch (data['ntype']) {
      case 0:
        node = new RFAdder(data['name'], data['pos'], pl)
        break;
      case 1:
        node = new RFMult(data['name'], data['pos'], pl)
        break;
      case 2:
        node = new RFConst(data['name'], data['pos'], pl)
        break;
      case 3:
        node = new RFAudio(data['name'], data['pos'], pl)
        break;
      case 4:
        node = new RFTransmitter(data['name'], data['pos'], pl)
        break;
      case 5:
        node = new RFReciever(data['name'], data['pos'], pl)
        break;
      case 7:
        node = new RFPlayer(data['name'], data['pos'], pl)
        break;
      case 8:
        node = new RFCopy(data['name'], data['pos'], pl)
        break;
      case 10:
        node = new RFOscillator(data['name'], data['pos'], pl)
        break;
      case 11:
        node = new RFUpconverter(data['name'], data['pos'], pl)
        break;
      default:
        node = new RFEmpty(pl)
        break
    }
    node.restoreState(data['data'])
    return node
  }

  destroy() {
    if (this.contextOpen) { this.destroyContextMenu() }
    if (this.pdestroy != undefined) { this.pdestroy() }
  }
  start() {
    this.cstate = 1
    if (this.pstart != undefined) { this.pstart() }
  }
  stop() {
    this.cstate = 0
    if (this.pstop != undefined) { this.pstop() }
  }
  reset() {
    this.cstate = 2
    if (this.preset != undefined) { this.preset() }
  }

  drawSquircle(pl, pos, size, width, col, fillColor = undefined) {
    pl.ctx.beginPath()
    pl.ctx.lineWidth = width
    pl.ctx.strokeStyle = col
    pl.ctx.fillStyle = "none"
    
    const arcLen = 20;
    pl.ctx.arc(
      pos[0] - size[0] / 2 + arcLen,
      pos[1] - size[1] / 2 + arcLen,
      arcLen, Math.PI * 2 / 2, Math.PI * 3 / 2, 0)
    pl.ctx.arc(
      pos[0] + size[0] / 2 - arcLen,
      pos[1] - size[1] / 2 + arcLen,
      arcLen, Math.PI * 3 / 2, Math.PI * 4 / 2, 0)
    pl.ctx.arc(
      pos[0] + size[0] / 2 - arcLen,
      pos[1] + size[1] / 2 - arcLen,
      arcLen, Math.PI * 4 / 2, Math.PI * 5 / 2, 0)
    pl.ctx.arc(
      pos[0] - size[0] / 2 + arcLen,
      pos[1] + size[1] / 2 - arcLen,
      arcLen, Math.PI * 5 / 2, Math.PI * 6 / 2, 0)
    pl.ctx.moveTo(pos[0] - size[0] / 2            , pos[1] - size[1] / 2 + arcLen)
    pl.ctx.lineTo(pos[0] - size[0] / 2            , pos[1] + size[1] / 2 - arcLen)
    pl.ctx.stroke()
    if (fillColor != undefined) {
      pl.ctx.fillStyle = fillColor 
      pl.ctx.fill()
    }
  }

  destroyContextMenu() {
   console.log(`This ${this.input} ${this.button}`)
   if (this.input != undefined) {this.input.remove()}
   if (this.button != undefined) {this.button.remove()}
  }

  drawText(pl, pos, string) {
    pl.ctx.beginPath()
    pl.ctx.textBaseline = 'top'
    pl.ctx.textAlign = 'left'
    pl.ctx.strokeStyle = 'red'
    pl.ctx.fillStyle = '#e3e3e3'
    pl.ctx.font = '14px jetbrains-mono'
    pl.ctx.fillText(string, pos[0], pos[1])
  }

  initContextMenu() { }

  drawContextMenu(pl, pos) {
    const cpos = [pos[0], pos[1] - 50 - 140]
    const csz = [200, 160]
    const tpos = [cpos[0] - csz[0] / 2 + 20, cpos[1]]
    const tsz = [120, 50]
    if (this.input != undefined) {
      this.input.style.width = (tsz[0]) + 'px'
      this.input.style.height = (tsz[1]) + 'px'
      this.input.style.left = (this.pl.canvasPos[0] + tpos[0]) + 'px'
      this.input.style.top = (this.pl.canvasPos[1] + tpos[1]) + 'px'
    }
    if (this.button != undefined) {
      this.button.style.width = (tsz[0]) + 'px'
      this.button.style.height = (tsz[1]) + 'px'
      this.button.style.left = (this.pl.canvasPos[0] + tpos[0]) + 'px'
      this.button.style.top = (this.pl.canvasPos[1] + tpos[1]) + 'px'
    }
    this.drawSquircle(pl, cpos, csz, 1, "#FFFFFF")
    pl.ctx.fillStyle = "#242526"
    pl.ctx.fill()
    this.drawText(pl, [tpos[0], tpos[1] - 40], this.name)
  }

  inputHandleFocus() { this.pl.curaction = 0 }

  inputHandleInput(e) {
    const keycode = e.keyCode
    this.pl.curaction = 0
    if (keycode == 13) { this.contextOpen = false }
  }

  draw(pl, pos, size) {
    let col
    if (this.focused == true) { col = "#029919" } else { col = "white" }
    this.pdraw(pl, pos, size, col)
    if (this.contextOpen) {
      this.drawContextMenu(pl, pos)
    } else {
      if (this.input != undefined) {
        this.input.style.visibility = 'hidden'
      }
      if (this.button != undefined) {
        this.button.style.visibility = 'hidden'
      }
    }
  }

  pullVals() {
    this.facets.forEach((facet, fi) => {
      if (facet.iout == 0 || facet.iout == 2) {
        if (facet.link == null) {
          facet.val = new AudioPacket(0);
          //console.log(`Pulled NOTHING ${this.id}.${fi} -> ${facet.link[0]}.${facet.link[1]}`)
        } else {
          facet.val = this.pl.nodes[facet.link[0]].facets[facet.link[1]].val;
          if (facet.val == undefined) {
            console.error(`Found undefined packet! ${this.id}.${fi} -> ${facet.link[0]}.${facet.link[1]}`)
          }
          //console.log(`Pulled ${this.id}.${fi} -> ${facet.link[0]}.${facet.link[1]} ${facet.val.toString()}`)
        }
      }
    })
  }

  pdraw(pl, pos, size, col) {}
  pupdate() {}
  update() {
    this.pullVals()
    this.pupdate()
  }
}

class RFEmpty extends RFElement {
  constructor(pl) { 
    super('', [99999999, 99999999], pl); 
    this.ntype = 999999
    this.x = 999999
    this.y = 999999
    this.h = 0
    this.w = 0
    this.facets = []
  }

  initContextMenu() {}
  pdraw(pl, pos, size, col) {}
  pupdate() {}
}

class RFAudio extends RFElement {
  constructor(name, pos, pl) { 
    super(name, pos, pl); 
    this.ntype = 3
    this.x = pos[0]
    this.y = pos[1]
    this.h = 100
    this.w = 150
    this.facets = [
      {x: 50, y: 0, h: 30, w: 30, iout: 1},
    ]
    this.lastUri = ''
  }

  async processAudioData(file) {
    const audioData = await file.arrayBuffer()
    const audioCtx = new AudioContext({sampleRate:44100})
    const a = await audioCtx.decodeAudioData(audioData)
    this.audioSampleRate = a.sampleRate
    this.audioDuration = a.duration
    this.audioLength = a.length + 1024
    this.lastSample = 0
    const padding = new Float32Array(512).fill(0.0)
    const finalArray = new Float32Array(1024 + a.length)
    finalArray.set(padding)
    finalArray.set(a.getChannelData(0), 512)
    finalArray.set(padding, 512 + a.length)
    this.audioData = finalArray
    //console.log(a.length, a.duration, a.sampleRate, a.numberOfChannels)
  }

  serialize() { return {'audioPath': this.lastUri} }
  restoreState(data) { if (data['audioPath'] != undefined) { this.fetchDataFromLink(data['audioPath']) } }

  async fetchDataFromLink(uri) {
    //console.log(`link ${uri}`)
    this.lastUri = uri
    let audioFile = await fetch(uri)
    await this.processAudioData(audioFile)
  }

  initContextMenu() {
    this.name = "Alege fisier audio"

    this.input.style.position = 'fixed'
    this.input.type = 'file'
    this.input.pl = this.pl
    this.input.node = this
    this.input.style.visibility = 'hidden'
    this.input.onchange = (event) => { 
      const file = event.target.files[0]
      if (file) { 
        this.processAudioData(file)
        this.button.style.background = seccol
      }
    }

    this.button.style.position = 'fixed'
    this.button.style.visibility = 'visible'
    // this.button.style.border = 'none'
    // this.button.style.outline = 'none'
    this.button.style.background = fgcol
    this.button.style.color = 'black'
    this.button.input = this.input
    this.button.node = this
    this.button.onclick = (event) => { 
      this.input.click(); 
    }

    document.body.appendChild(this.button)
    document.body.appendChild(this.input)
  }

  preset() { this.lastSample = 0 }

  pdraw(pl, pos, size, col) {
    this.drawSquircle(pl, pos, size, 2, col)
    pl.ctx.strokeStyle = col
    pl.ctx.fillStyle = col

    const off = [-4, 2]

    pl.ctx.beginPath();
    pl.ctx.ellipse(pos[0] - 25 + off[0], pos[1] + 20 + off[1], 20, 15, 0, 0, Math.PI * 2);
    pl.ctx.fill();

    pl.ctx.beginPath();
    pl.ctx.moveTo(pos[0] - 10 + off[0], pos[1] + 20 + off[1]);
    pl.ctx.lineTo(pos[0] - 10 + off[0], pos[1] - 40 + off[1]);
    pl.ctx.lineWidth = 6;
    pl.ctx.stroke();

    pl.ctx.beginPath();
    pl.ctx.moveTo(pos[0] - 10 + off[0], pos[1] - 40 + off[1]);
    pl.ctx.bezierCurveTo(
      pos[0] + 10 + off[0], pos[1] - 20 + off[1],
      pos[0] + 10 + off[0], pos[1] - 20 + off[1],
      pos[0] - 10 + off[0], pos[1] - 10 + off[1]
    );
    pl.ctx.lineWidth = 4;
    pl.ctx.stroke();
  }

  //isRunning() { return this.lastSample < this.audioLength }

  pupdate() {
    const cp = new AudioPacket(0)
    let curPos = 0
    if (this.audioData != undefined) {
      while (curPos < 512) {
        cp.arr[curPos] = this.audioData[this.lastSample % this.audioLength]
        ++this.lastSample
        ++curPos
      }
    }
    /*
    if (this.audioData != undefined && this.lastSample < this.audioLength) {
      while (curPos < 512 && this.lastSample < this.audioLength) {
        cp.arr[curPos] = this.audioData[this.lastSample]
        ++this.lastSample
        ++curPos
      }
    }
    */
    this.facets[0].val = cp
  }
}

class RFCopy extends RFElement {
  constructor(name, pos, pl) { 
    super(name, pos, pl); 
    this.ntype = 8
    this.x = pos[0]
    this.y = pos[1]
    this.h = 100
    this.w = 150
    this.facets = [
      {x:-75, y:   0, h: 30, w: 30, iout: 0},
      {x: 75, y: -50, h: 30, w: 30, iout: 1},
      {x: 75, y:  50, h: 30, w: 30, iout: 1},
    ]
  }

  pdraw(pl, pos, size, col) {
    this.drawSquircle(pl, pos, size, 2, col)
    pl.ctx.beginPath();
    pl.ctx.strokeStyle = col;
    pl.ctx.lineWidth = 2;

    const ll = pl.downSz(10, 10);
    const sl = pl.downSz(5, 10);
    const cl = pl.downSz(30, 10);
    pl.ctx.stroke()
    pl.ctx.beginPath();
    pl.ctx.arc(pos[0], pos[1], cl[0], 0, 2 * Math.PI)
    pl.ctx.stroke()
  }

  pupdate() {
    this.facets[1].val = this.facets[0].val
    this.facets[2].val = this.facets[0].val
  }
}

class RFAdder extends RFElement {
  constructor(name, pos, pl) { 
    super(name, pos, pl); 
    this.ntype = 0
    this.x = pos[0]
    this.y = pos[1]
    this.h = 100
    this.w = 150
    this.facets = [
      {x: -75, y: 50, h: 30, w: 30, iout: 0},
      {x: -75, y: -50, h: 30, w: 30, iout: 0},
      {x: 75, y: 0, h: 30, w: 30, iout: 1},
    ]
  }

  initContextMenu() { this.contextOpen = false }

  pdraw(pl, pos, size, col) {
    this.drawSquircle(pl, pos, size, 2, col)
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

  pupdate() {
    this.facets[2].val = this.facets[0].val.add(this.facets[1].val)
  }
}

class RFMult extends RFElement {
  constructor(name, pos, pl) { 
    super(name, pos, pl); 
    this.ntype = 1
    this.x = pos[0]
    this.y = pos[1]
    this.h = 100
    this.w = 150
    this.facets = [
      {x: -75, y: 50, h: 30, w: 30, iout: 0},
      {x: -75, y: -50, h: 30, w: 30, iout: 0},
      {x: 75, y: 0, h: 30, w: 30, iout: 1},
    ]
  }

  initContextMenu() { this.contextOpen = false }

  pdraw(pl, pos, size, col) {
    this.drawSquircle(pl, pos, size, 2, col)
    const [x, y] = pos;
    const sz = 10;
    const dl = 8;
    const ds = 5;

    pl.ctx.beginPath();
    pl.ctx.strokeStyle = col;
    pl.ctx.fillStyle = col;
    pl.ctx.lineWidth = 2;
    pl.ctx.arc(x, y, 30, 0, Math.PI * 2);
    pl.ctx.stroke();

    pl.ctx.beginPath();
    pl.ctx.moveTo(x          , y - ds     );
    pl.ctx.lineTo(x      + dl, y - ds - dl);
    pl.ctx.lineTo(x + ds + dl, y      - dl);
    pl.ctx.lineTo(x + ds     , y          );
    pl.ctx.lineTo(x + ds + dl, y      + dl);
    pl.ctx.lineTo(x      + dl, y + ds + dl);
    pl.ctx.lineTo(x          , y + ds     );
    pl.ctx.lineTo(x      - dl, y + ds + dl);

    pl.ctx.lineTo(x - ds - dl, y      + dl);
    pl.ctx.lineTo(x - ds     , y          );
    pl.ctx.lineTo(x - ds - dl, y      - dl);
    pl.ctx.lineTo(x      - dl, y - ds - dl);
    pl.ctx.lineTo(x          , y - ds     );
    pl.ctx.stroke()
  }

  pupdate() {
    this.facets[2].val = this.facets[0].val.mult(this.facets[1].val)
  }
}

class RFConst extends RFElement {
  constructor(name, pos, pl) { 
    super(name, pos, pl); 
    this.ntype = 2
    this.x = pos[0]
    this.y = pos[1]
    this.h = 100
    this.w = 100
    this.facets = [
      {x: 50, y: 0, h: 30, w: 30, iout: 1},
    ]
    this.constant = 0.0
  }

  serialize() { return {'constant': this.constant} }
  restoreState(data) { console.log("Const", data); this.constant = data['constant'] }

  initContextMenu() {
    this.input.style.position = 'fixed'
    this.input.type = 'text'
    this.input.pl = this.pl
    this.input.node = this

    this.name = "Valoare Constanta"
    this.input.style.visibility = 'visible'
    this.input.style.border = 'none'
    this.input.style.outline = 'none'
    this.input.style.background = ghostcol;
    this.input.style.color = fgcol
    this.input.value = this.constant

    this.input.onkeydown = this.inputHandleInput
    this.input.onfocus = this.inputHandleFocus
    document.body.appendChild(this.input)
  }

  inputHandleInput(e) {
    this.pl.curaction = 0
    const keycode = e.keyCode
    if (keycode == 13) { 
      let res = parseFloat(this.value)
      console.log(`r ${res}`)
      this.node.constant = res
      if (res != NaN) {
        this.node.contextOpen = false 
        this.pl.drawGraph()
      }
    }
  }

  pdraw(pl, pos, size, col) {
    this.drawSquircle(pl, pos, size, 2, col)
    pl.ctx.beginPath();
    pl.ctx.strokeStyle = col;
    pl.ctx.fillStyle = col;
    pl.ctx.lineWidth = 2;

    const [x, y] = pos;
    const w = 26;
    const h = 10;
    const s = 6;

    pl.ctx.beginPath();
    pl.ctx.lineWidth = 2;
    pl.ctx.arc(x, y, 30, 0, Math.PI * 2);
    pl.ctx.stroke();

    pl.ctx.beginPath();
    pl.ctx.moveTo(x - w / 2, y - s / 2);
    pl.ctx.lineTo(x + w / 2, y - s / 2);
    pl.ctx.lineTo(x + w / 2, y - s / 2 - h);
    pl.ctx.lineTo(x - w / 2, y - s / 2 - h);
    pl.ctx.lineTo(x - w / 2, y - s / 2);
    pl.ctx.stroke()

    pl.ctx.beginPath();
    pl.ctx.moveTo(x - w / 2, y + s / 2);
    pl.ctx.lineTo(x + w / 2, y + s / 2);
    pl.ctx.lineTo(x + w / 2, y + s / 2 + h);
    pl.ctx.lineTo(x - w / 2, y + s / 2 + h);
    pl.ctx.lineTo(x - w / 2, y + s / 2);
    pl.ctx.stroke()
  }

  pupdate() {
    const cp = new AudioPacket(0)
    for (let i = 0; i < 512; ++i) {
      cp.arr[i] = this.constant
    }
    this.facets[0].val = cp
  }
}

class RFReciever extends RFElement {
  constructor(name, pos, pl) { 
    super(name, pos, pl); 
    this.ntype = 5
    this.x = pos[0]
    this.y = pos[1]
    this.h = 100
    this.w = 100
    this.facets = [
      {x: 50, y: 0, h: 30, w: 30, iout: 1},
    ]
    this.packets = []
    this.worker = new Worker("/src/routes/playground/Worker.js");

    this.worker.onmessage = (e) => {
      //console.log(e.data)
      const cp = new AudioPacket(1, e.data)
      this.packets.push(cp)
    }
    this.worker.onerror = (error) => {console.error(`Worker Error ${error.message} ${error.filename}:${error.lineno}:${error.colno}`); this.worker.terminate()}
  }

  pdraw(pl, pos, size, col) {
    this.drawSquircle(pl, pos, size, 2, col)
    pl.ctx.beginPath();
    pl.ctx.strokeStyle = col;
    pl.ctx.lineWidth = 3;

    const [x, y] = pos;
    const waveCount = 5
    const waveGap = 9
    const angle = 0.7

    for (let i = 1; i <= waveCount; i++) {
       pl.ctx.beginPath();
       pl.ctx.arc(x - 20, y, waveGap * i, angle, -angle, true);
       pl.ctx.stroke();
    }
  }

  pdestroy() { this.worker.terminate() }

  pstart() { this.worker.postMessage({'type': 'startReading'}) }

  pstop() { this.worker.postMessage({'type': 'stopReading'}) }

  preset() { this.packets = []; this.delay = 0 }

  pupdate() {
    this.delay += 1
    if (this.delay > 10) {
      if (this.packets.length == 0) {
        //console.log(`Got packet NOTHING`)
        this.facets[0].val = new AudioPacket(0)
      } else {
        //console.log(`Got packet ${this.packets[0].toString()}`)
        this.facets[0].val = this.packets[0]
        this.packets.shift()
      }
    } else {
        this.facets[0].val = new AudioPacket(0)
    }
  }
}

class RFTransmitter extends RFElement {
  constructor(name, pos, pl) { 
    super(name, pos, pl); 
    this.ntype = 4
    this.x = pos[0]
    this.y = pos[1]
    this.h = 100
    this.w = 100
    this.facets = [
      {x: -50, y: 0, h: 30, w: 30, iout: 0},
    ]
    this.worker = new Worker("/src/routes/playground/Worker.js");

    this.worker.onmessage = (e) => {}
    this.worker.onerror = (error) => {console.error(`Worker Error ${error.message} ${error.filename}:${error.lineno}:${error.colno}`); this.worker.terminate()}
    this.worker.postMessage({'type': 'startStream'})
  }

  destroy() {
    if (this.worker != undefined) {this.worker.terminate()}
    if (this.contextOpen) { this.destroyContextMenu() }
  }

  pdraw(pl, pos, size, col) {
    this.drawSquircle(pl, pos, size, 2, col)
    pl.ctx.beginPath();
    pl.ctx.strokeStyle = col;
    pl.ctx.lineWidth = 3;

    const [x, y] = pos;
    const waveCount = 5
    const waveGap = 9
    const angle = 0.7

    for (let i = 1; i <= waveCount; i++) {
       pl.ctx.beginPath();
       pl.ctx.arc(x - 20, y, waveGap * i, angle, -angle, true);
       pl.ctx.stroke();
    }
  }

  destroyContextMenu() { if (this.ppl != undefined) { this.ppl.destroy() } }
  pupdate() { 
    const tval = this.facets[0].val.toCFreq()
    this.worker.postMessage({'type': 'data', 'data': tval})
  }
}

class RFPlayer extends RFElement {
  constructor(name, pos, pl) { 
    super(name, pos, pl); 
    this.ntype = 7
    this.x = pos[0]
    this.y = pos[1]
    this.h = 100
    this.w = 100
    this.facets = [
      {x: -50, y: 0, h: 30, w: 30, iout: 0},
    ]
  }

  pdraw(pl, pos, size, col) {
    this.drawSquircle(pl, pos, size, 2, col)
    pl.ctx.beginPath();
    pl.ctx.strokeStyle = col;
    pl.ctx.lineWidth = 3;

    const [x, y] = pos;
    const waveCount = 5
    const waveGap = 9
    const angle = 0.7

    for (let i = 1; i <= waveCount; i++) {
       pl.ctx.beginPath();
       pl.ctx.arc(x, y + 15, waveGap * i, 3.14 * 3 / 2 - angle, 3.14 * 3 / 2 + angle);
       pl.ctx.stroke();
    }
  }

  preset() {
    this.ap = new AudioPlayer()
    this.ap.init()
    /*
    if (this.ppl != undefined) { this.ppl.destroy() }
    this.ppl = new PCMPlayer({
      encoding: '32bitFloat',
      channels: 1,
      sampleRate: 44100,
      flushingTime: 10000
    })
    this.ppl.flush()*/
  }

  pstop() { 
    if (this.ppl != undefined) {this.ppl.destroy() }
    if (this.ap != undefined) {this.ap.stop()}
  }

  pupdate() {
    if (this.ap != undefined) {
      const tval = this.facets[0].val.toTime()
      //console.log(`Rval ${tval.toString()}`)
      const f32 = new Float32Array(tval.arr)
      this.ap.addData(f32)
    }
  }
}

class RFOscillator extends RFElement {
  constructor(name, pos, pl) { 
    super(name, pos, pl); 
    this.ntype = 10
    this.x = pos[0]
    this.y = pos[1]
    this.h = 100
    this.w = 100
    this.facets = [
      {x: 50, y: 0, h: 30, w: 30, iout: 1},
    ]
    this.samples = []
    this.freq = 440.0
    // this.freq = 64 * 44100.0 / 512.0

    this.amplitude = 0.4
  }

  preset() { this.foffset = 0 }

  serialize() { return {'freq': this.freq} }
  restoreState(data) { this.freq = data['freq'] }

  reset() {
    this.startTime = new Date().getTime()
  }

  initContextMenu() {
    this.input.style.position = 'fixed'
    this.input.type = 'text'
    this.input.pl = this.pl
    this.input.node = this

    this.name = "Frecventa Oscilator"
    this.input.style.visibility = 'visible'
    this.input.style.border = 'none'
    this.input.style.outline = 'none'
    this.input.style.background = ghostcol;
    this.input.style.color = fgcol
    this.input.value = this.freq

    this.input.onkeydown = this.inputHandleInput
    this.input.onfocus = this.inputHandleFocus
    document.body.appendChild(this.input)
  }

  inputHandleInput(e) {
    this.pl.curaction = 0
    const keycode = e.keyCode
    if (keycode == 13) { 
      let res = parseFloat(this.value)
      console.log(`r ${res}`)
      this.node.freq = res
      if (res != NaN) {
        this.node.contextOpen = false 
        this.pl.drawGraph()
      }
    }
  }

  pdraw(pl, pos, size, col) {
    this.drawSquircle(pl, pos, size, 2, col)
    pl.ctx.beginPath();
    pl.ctx.strokeStyle = col;
    pl.ctx.lineWidth = 3;

    const [x, y] = pos;

    pl.ctx.beginPath()
    pl.ctx.arc(x, y, 30, 0, Math.PI * 2);
    pl.ctx.stroke()

    pl.ctx.beginPath()
    pl.ctx.moveTo(x - 20, y)
    pl.ctx.bezierCurveTo(x - 0, y - 30, x + 0, y + 30, x + 20, y)
    pl.ctx.stroke()
  }

  pupdate() {
    if (this.foffset == undefined) { this.foffset = 0 }
    const cp = AudioPacket.freqPacket(this.freq, this.amplitude, this.foffset * 512)
    this.foffset += 1
    this.facets[0].val = cp.toFreq()
  }
}

class RFUpconverter extends RFElement {
  constructor(name, pos, pl) { 
    super(name, pos, pl); 
    this.ntype = 11
    this.x = pos[0]
    this.y = pos[1]
    this.h = 100
    this.w = 100
    this.facets = [
      {x: -50, y: 0, h: 30, w: 30, iout: 0},
      {x: 50, y: 0, h: 30, w: 30, iout: 1},
    ]
    this.samples = []
    this.freq = 64 * 44100.0 / 512.0
  }

  initContextMenu() {
    this.input.style.position = 'fixed'
    this.input.type = 'text'
    this.input.pl = this.pl
    this.input.node = this

    this.name = "Oscillator output"
    this.input.style.visibility = 'visible'
    this.input.style.border = 'none'
    this.input.style.outline = 'none'
    this.input.style.background = ghostcol;
    this.input.style.color = fgcol
    this.input.value = this.freq

    this.input.onkeydown = this.inputHandleInput
    this.input.onfocus = this.inputHandleFocus
    document.body.appendChild(this.input)
  }

  inputHandleInput(e) {
    this.pl.curaction = 0
    const keycode = e.keyCode
    if (keycode == 13) { 
      let res = parseFloat(this.value)
      console.log(`r ${res}`)
      this.node.freq = res
      if (res != NaN) {
        this.node.contextOpen = false 
        this.pl.drawGraph()
      }
    }
  }

  pdraw(pl, pos, size, col) {
    this.drawSquircle(pl, pos, size, 2, col)
    pl.ctx.beginPath();
    pl.ctx.strokeStyle = col;
    pl.ctx.lineWidth = 3;

    const [x, y] = pos;

    pl.ctx.beginPath()
    pl.ctx.arc(x, y, 30, 0, Math.PI * 2);
    pl.ctx.stroke()

    pl.ctx.beginPath()
    pl.ctx.moveTo(x - 20, y)
    pl.ctx.bezierCurveTo(x - 0, y - 30, x + 0, y + 30, x + 20, y)
    pl.ctx.moveTo(x + 20, y)
    pl.ctx.bezierCurveTo(x - 0, y - 30, x + 0, y + 30, x + 20, y)
    pl.ctx.stroke()
  }

  pupdate() {
    const cp = new AudioPacket(2, this.facets[0].val.toFreq().arr)
    cp.upconvert(this.freq)
    this.facets[1].val = cp
  }
}

export class Playground {
  constructor(canvas, nodeButtons) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d");
    this.nodes = []
    this.hovernode = null
    this.curaction = 0
    this.nextNodeType = 99999
    this.nodeButtons = nodeButtons
    this.nodeUpdateOrder = [] 
    this.nextid = 0
  }

  serialize() {
    let nodeData = []
    for (let i = 0; i < this.nodes.length; ++i) {
      let conns = []
      for (let j = 0; j < this.nodes[i].facets.length; ++j) {
        if (this.nodes[i].facets[j].iout == 1 && 
            this.nodes[i].facets[j].link != null && 
            this.nodes[i].facets[j].link != undefined) {
          conns.push([i, this.nodes[i].facets[j].link])
        }
      }
      nodeData.push({
        'pos': [this.nodes[i].x, this.nodes[i].y],
        'name': this.nodes[i].name,
        'ntype': this.nodes[i].ntype,
        'conns': conns,
        'data': this.nodes[i].serialize()
      })
    }
    return JSON.stringify(nodeData)
  }

  fromSerial(state) {
    let data = JSON.parse(state)
    for (let node of this.nodes) {node.destroy()}
    this.nodes = []
    for (let cnode of data) {
      this.nodes.push(RFElement.fromSerial(this, cnode))
    }

    console.log(this.nodes)

    let i = 0
    for (let cnode of data) {
      for (let con of cnode['conns']) {
        console.log(`Linking ${i} ${con[0]} ${con[1]}`)
        this.linkFacets([i, con[0]], con[1]) 
      }
      ++i
    }
    this.drawGraph()
  }

  updateNodeUpdateOrder() {
    this.circularNodes = false
    const nlen = this.nodes.length
    let nodeLinks = []
    this.nodeUpdateOrder = [] 
    let cupdate = []
    let mlen = []
    let olen = []
    for (let i = 0; i < nlen; i++) {
      if (this.nodes[i].ntype == 999999) { 
        mlen.push(999999)
        olen.push(999999)
        nodeLinks.push([])
        continue; 
      }
      let clinks = []
      let inc = 0
      for (let f of this.nodes[i].facets) {
        if (f.link != null && f.iout == 1) {
          //console.log(`Link ${f.link[0]} -> ${i}`)
          clinks.push(f.link[0])
        } else if (f.iout == 0) {
          inc++
        }
      }
      //console.log(`inc ${inc}`)
      if (inc == 0) { 
        cupdate.push([i, 0])
        mlen.push(0)
        olen.push(0)
      } else {
        mlen.push(inc)
        olen.push(inc)
      }
      nodeLinks.push(clinks)
      //console.log(`curi ${i + 1} / ${nlen}`)
    }

    while (cupdate.length > 0) {
      let cn = cupdate[0][0]
      let cd = cupdate[0][1]
      // console.log(`Processing ${cn} ${cd} ${mlen[cn]} ${mlen}`)
      this.nodeUpdateOrder.push(cn)
      cupdate.shift()
      for (let j = 0; j < nodeLinks[cn].length; ++j) {
        const nnode = nodeLinks[cn][j]
        mlen[nnode] -= 1
        if (mlen[nnode] == 0) {
          cupdate.push([nnode, cd + 1])
        } else if (mlen[nnode] < 0) {
          cupdate = []
          this.nodeUpdateOrder = []
          this.circularNodes = true
          break
        }
      }
    }
    /*
    for (let i = 0; i < nlen; i++) {
      if (this.nodes[i].ntype == 999999) { continue; }
      if (0 < mlen[i] && mlen[i] < olen[i]) {
        cupdate = []
        this.nodeUpdateOrder = []
        this.circularNodes = true
        break
      }
    }
    */

    console.log(`Update order ${this.nodeUpdateOrder}`)
  }

  updateNodes() {
    //console.log("Update queued")
    for (let i of this.nodeUpdateOrder) {
      this.nodes[i].update()
    }
  }

  updateBounds(w, h) {
    this.bounding = this.canvas.getBoundingClientRect()
    this.canvasPos = [this.bounding.x, this.bounding.y]
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
  }

  upPose(x, y) {
    let fixX = x * this.bounding.width
    let fixY = y * this.bounding.height
    return [ fixX, fixY ]
  }

  nodeCenter(id) {
    return this.upPose(this.nodes[id[0]].x, this.nodes[id[0]].y)
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
    this.ctx.fillStyle = style
    this.ctx.stroke()
  }

  drawBezier(c1, c2, p1, p2, width, style) {
    this.ctx.beginPath()
    this.ctx.moveTo(c1[0], c1[1])
    this.ctx.bezierCurveTo(c1[0] + p1[0], c1[1] + p1[1], c2[0] + p2[0], c2[1] + p2[1], c2[0], c2[1])
    this.ctx.lineWidth = width
    this.ctx.strokeStyle = style
    this.ctx.fillStyle = style
    this.ctx.stroke()
  }

  dif2(o1, o2) { return [o1[0] - o2[0], o1[1] - o2[1]] }
  drawConnection(start, end) {
    const c1 = this.facetCenter(start)
    const c2 = this.facetCenter(end)
    const dist2 = this.dif2(c1, c2)
    //const dist = Math.sqrt(dist2[0] * dist2[0] + dist2[1] * dist2[1])
    const off1 = this.dif2(c1, this.nodeCenter(start))
    off1[0] *= dist2[0] / 100
    off1[1] *= dist2[1] / 100
    const off2 = this.dif2(c2, this.nodeCenter(end))
    off2[0] *= dist2[0] / 100
    off1[1] *= dist2[1] / 100
    this.drawBezier(c1, c2, off1, off2, 3, "white")
  }

  drawGraph() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    /*
    if (this.circularNodes == true) {
      this.ctx.rect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.fillStyle = "#b04040"
      this.ctx.fill() /// TODO: Make clearer
      this.ctx.font = "50px JetbrainsMono"
      this.ctx.fillText("Unconnected nodes or circular connection!", 30, 30)
    }
    */

    let kms = this.canvas.getBoundingClientRect()
    this.nodes.forEach((node, ni) => {
      if (node != undefined) {
        node.facets.forEach((facet, fi) => {
          if (facet.link != null) {
            if (facet.iout == 0) {
              this.drawConnection([ni, fi], facet.link)
            }
          }
        })
      }
    })
    
    this.nodes.forEach((node, ni) => { if (node != undefined) {
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
        this.ctx.fillStyle = "green"
      } else {
        this.ctx.fillStyle = "blue"
      }
      this.ctx.fill()
      this.ctx.strokeStyle = "white"
      this.ctx.stroke()
      this.ctx.beginPath()
      node.facets.forEach((facet, fi) => {
        this.ctx.beginPath()
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
        this.ctx.strokeStyle = "#FFFFFF"; this.ctx.stroke();
      })
    }})
  }

  shouldRunSimulation() {
    return !this.nodes.some((node) => {
      return !node.isRunning()
    })
  }

  stopSimulation() {
    this.simulationStatus = 0
    console.log("StopSim")
    if (this.simulationLoop != undefined) { clearInterval(this.simulationLoop)  }
    for (let node of this.nodes) {node.stop()}
  }

  startSimulation() {
    if (this.simulationStatus === 1) {
      this.simulationStatus = 2
      clearInterval(this.simulationLoop) 
      console.log("PauseSim")
      return
    } else if (this.simulationStatus != 2) {
      for (let node of this.nodes) {
        node.start()
        node.reset()
      }
    } else {
      for (let node of this.nodes) {
        if (node.cstate == 0) {
          node.start()
          node.reset()
        }
      }
    }
    this.simulationStatus = 1;
    console.log("StartSim")

    this.simulationLoop = setInterval(() => {
      this.updateNodes()
      if (!this.shouldRunSimulation()) {
        this.stopSimulation()
      }
    }, (512000 / 44100) * 0.97)
  }

  addNode(f, nodeType) {
    if (nodeType == undefined) {
      nodeType = this.nextNodeType
    }
    switch (nodeType) {
      case 0:
        this.nodes.push(new RFAdder("Adunator", f, this))
        break
      case 1:
        this.nodes.push(new RFMult("Inmultitor", f, this))
        break
      case 2:
        this.nodes.push(new RFConst("Constant", f, this))
        break
      case 3:
        this.nodes.push(new RFAudio("Audio", f, this))
        break
      case 4:
        this.nodes.push(new RFTransmitter("Transmitator", f, this))
        break
      case 5:
        this.nodes.push(new RFOscillator("Oscilator", f, this))
        break
      case 6:
        this.nodes.push(new RFReciever("Receptor", f, this))
        break
      case 7:
        this.nodes.push(new RFPlayer("Player", f, this))
        break
      case 8:
        this.nodes.push(new RFCopy("Copiator", f, this))
        break
      case 9:
        this.nodes.push(new RFUpconverter("Upco", f, this))
        break
      default:
        this.startSimulation()
        break
    }

    this.updateNodeUpdateOrder()

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
    if (cnode != null && cnode[1] == 0) { 
      this.nodes[cnode[0]].focused = true 
      this.selnode = cnode
    }
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

  linkFacets(f1, f2) {
    if (f1 != null) {
      console.log(`Linking ${this.nodes} ${f1} ${f2}`)
      const oldInLink = this.nodes[f1[0]].facets[f1[1]].link
      const oldOutLink = this.nodes[f2[0]].facets[f2[1]].link
      if (oldInLink != undefined && oldInLink[0] == f2[0] && oldInLink[1] == f2[1]) {
        this.nodes[f1[0]].facets[f1[1]].link = null 
        this.nodes[f2[0]].facets[f2[1]].link = null
        this.updateNodeUpdateOrder()
        return 
      }
      if (oldInLink != null) { 
        if (this.nodes[oldInLink[0]].facets[oldInLink[1]].link == f2) {
          this.nodes[f1[0]].facets[f1[1]].link = null 
          this.nodes[f2[0]].facets[f2[1]].link = null
          this.updateNodeUpdateOrder()
          return
        }
        this.nodes[oldInLink[0]].facets[oldInLink[1]].link = null 
      }
      if (oldOutLink != null) {
        this.nodes[oldOutLink[0]].facets[oldOutLink[1]].link = null 
      }
      this.nodes[f2[0]].facets[f2[1]].link = [f1[0], f1[1]] /// Output -> Input
      this.nodes[f1[0]].facets[f1[1]].link = [f2[0], f2[1]] /// Input <- Output
    }
    this.updateNodeUpdateOrder()
  }

  mouseUp(x, y) {
    const f = this.downPose(x, y)
    if (this.curaction == 0) {
      if (this.nextNodeType != 999) {
        this.addNode(f)
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

        this.linkFacets(inode, onode)
        this.curaction = 0
        this.drawGraph()
      }
    } else if (this.curaction == 2) {
      const cnode = this.gnode(this.getNodeAtPosition(f))
      if (cnode != null) {
        cnode.contextOpen = !cnode.contextOpen
        if (cnode.contextOpen) {
          cnode.initContextMenu()
        } else {
          cnode.destroyContextMenu()
        }
      }
      this.selnode = this.hovernode
    }
    this.curaction = 0
    this.drawGraph()
  }

  mouseMove(x, y) {
    //this.updateNodes()
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

      this.drawLine(c1, [x, y], 2, "white")
    }
  }

  static getMods(e) {
    return e.altKey << 3 | e.ctrlKey << 2 || e.shiftKey << 1 | e.metaKey
  }

  destroyNode(node) {
    console.log(`Destroying node ${node[0]}`)
    this.nodes[node[0]].facets.forEach((facet, fi) => {
      if (facet.link != undefined && facet.link != null) {
        this.linkFacets([node[0], fi], facet.link)
      }
    })
    this.nodes[node[0]].destroyContextMenu()
    this.nodes[node[0]] = new RFEmpty(this)
    this.drawGraph()
  }

  keydown(e) {
    if (e.key == 'c' && Playground.getMods(e) == 0) {
      console.log(this.serialize())
    }
    if (e.key == 'Delete' && Playground.getMods(e) == 0) {
      if (this.selnode != undefined) {
        this.destroyNode(this.selnode)
        this.selnode = undefined
      }
      console.log(e)
    }
  }

  destroy() {
    if (this.nodes != null && this.nodes != undefined) {
      this.nodes.forEach(node => {
        node.destroy()
      })
    }
  }
}
