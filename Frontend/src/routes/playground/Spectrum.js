let socket
let sopened = false
let readTimer
let drawTimer
export async function spectrumOnMount() {
  //socket = await new WebSocket('ws://localhost:8080')
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
}

export class Spectrum {
  constructor(canvas) {
    this.histogramLength = 200
    this.histogramWidth = 200
    this.canvas = canvas
    this.ctx = canvas.getContext("2d");
    this.histogram = new Array(this.histogramLength)
    for (let i = 0; i < this.histogramLength; ++i) { this.histogram[i] = new Float32Array(200) }
    this.histogramPos = 0
    socket.onmessage = this.backendResponse
    socket.spec = this
    if (sopened) {
      this.initComms()
    } else {
      socket.onopen = this.initComms
    }
  }

  initComms() {
    let arr = new Uint8Array(5)
    arr[0] = 1
    arr[1] = 0
    arr[2] = 20
    arr[3] = 0
    arr[4] = 0
    socket.send(arr)
  }

  async backendResponse(event) {
    const f32 = new Float32Array(await event.data.arrayBuffer())
    //if f32.len
    //this.spec.addFrame()
  }

  updateBounds(w, h) {
    this.bounding = canvas.getBoundingClientRect()
    this.canvasPos = [this.bounding.x, this.bounding.y]
    console.log(`Updb ${this.canvasPos} ${this.canvas.width}  ${this.canvas.height}`)
  }

  addFrame(data) {
    this.histogramPos += 1
    this.histogramPos %= 200
    this.histogram[this.histogramPos].set(data)
  }

  redraw() {
    this.ctx.drawImage(this.histogram, 0, 0, this.canvas.width, this.canvas.height)
    /*
    const pw = this.canvas.width / this.histogramLength
    const ph = this.canvas.height / this.histogramWidth
    for (let col = 0; col < this.histogramLength; ++col) {
      const cxp = pw * this.histogramLength - pw * (col + 1)
      for (let row = 0; row < this.histogramWidth; ++row) {
        const cyp = ph * this.histogramWidth - ph * (row + 1)
        const color = this.histogram[(this.histogramPos - col + this.histogramLength) % this.histogramLength][row] * 255
        this.ctx.fillStyle = `rgb(${color}, ${color}, ${color})` 
        this.ctx.fillRect(cxp, cyp, pw + 1, ph)
      }
    }
    */
  }

  update() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.ctx.rect(0, 0, canvas.width, canvas.height)
    this.ctx.fillStyle = "black"
    this.ctx.strokeStyle = "black"
  }
}

