//let socket
let sopened = false
let readTimer
let drawTimer
export async function spectrumOnMount() {
  /*
  socket = await new WebSocket('ws://localhost:8080')
  socket.onmessage = (event) => {}
  socket.onopen = () => {
    sopened = true
  }
  socket.onclose = () => {
    console.log('Spectrum websocket closed')
    clearInterval(readTimer)
    clearInterval(drawTimer)
  }
  socket.onerror = (error) => {console.log(`Spectrum websocket error ${error}`)}
  */
}

export class Spectrum {
  constructor(canvas) {
    this.histogramLength = 200
    this.histogramWidth = 514
    this.canvas = canvas
    this.ctx = canvas.getContext("2d");
    this.histogram = new Array(this.histogramLength)
    for (let i = 0; i < this.histogramLength; ++i) { this.histogram[i] = new Float32Array(this.histogramWidth) }
    this.histogramPos = 0
    this.createWorker()
    this.bitmapData = new Uint8ClampedArray(this.histogramWidth * this.histogramLength * 4)
    this.redrawer = setInterval(() => {this.redraw()}, 10)
  }

  createWorker() {
    if (window.Worker) {
      this.worker = new Worker("/src/routes/playground/Worker.js");

      this.worker.onmessage = (e) => {this.addFrame(e)}
      this.worker.onerror = (error) => {console.log(`Worker Error ${error.message} ${error.filename}:${error.lineno}:${error.colno}`); this.destroy()}
      this.worker.postMessage({'type': 'startReading'})
    } else {
      console.error("Your browser doesn't support web workers.");
    }
  }

  updateBounds(w, h) {
    this.bounding = this.canvas.getBoundingClientRect()
    this.canvasPos = [this.bounding.x, this.bounding.y]
    this.canvas.height = this.bounding.height
    this.canvas.width = this.bounding.width
    console.log(`Updb ${this.canvasPos} ${this.canvas.width}  ${this.canvas.height}`)
  }

  addFrame(data) {
    this.histogram[this.histogramPos].set(data.data)
    this.histogramPos += 1
    this.histogramPos %= 200
  }

  updateBitmap() {
    for (let col = 0; col < this.histogramLength; ++col) {
      const ccol = this.histogramLength - col - 1
      for (let row = 0; row < this.histogramWidth; ++row) {
        const crow = this.histogramWidth - row - 1
        const color = this.histogram[(this.histogramPos - col + this.histogramLength) % this.histogramLength][row] * 255
        this.bitmapData[(crow * this.histogramLength + ccol) * 4 + 0] = color
        this.bitmapData[(crow * this.histogramLength + ccol) * 4 + 1] = 0
        this.bitmapData[(crow * this.histogramLength + ccol) * 4 + 2] = color
        this.bitmapData[(crow * this.histogramLength + ccol) * 4 + 3] = 255
      }
    }
    return new ImageData(this.bitmapData, this.histogramLength, this.histogramWidth)
  }

  redraw() {
    const bmap = this.updateBitmap()
    this.ctx.putImageData(bmap, 0, 0, 0, 0, this.canvas.width, this.canvas.height)
    //this.ctx.drawImage(bmap, 0, 0, this.canvas.width, this.canvas.height)
  }

  update() {
    this.ctx.fillStyle = "black"
    this.ctx.strokeStyle = "black"
  }

  destroy() {
    clearInterval(this.redrawer)
    if (this.worker != undefined) {
      this.worker.terminate()
    }
  }
}

