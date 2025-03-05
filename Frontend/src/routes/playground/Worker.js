let socket;
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function waiter(func) { while (!func()) { await sleep(100) } }

async function startSocket() {
  socket = new WebSocket('ws://192.168.43.242:8080')
  socket.onmessage = (event) => {}
  socket.onopen = () => {console.log('Worker websocket opened')}
  socket.onclose = () => {console.log('WOrker websocket closed')}
  socket.onerror = (error) => {console.log(`Woeker websocket error ${error}`)}
}
startSocket()

let buffer = []

let sloop;
let toReset = false
async function startWebsocketLoop() {
  await waiter(() => { return socket.readyState == WebSocket.OPEN } )
  console.log("Start sending")
  sloop = setInterval(() => {
    //console.log(`Sender`)
    if (socket.readyState == WebSocket.CLOSED || socket.readyState == WebSocket.CLOSING) { console.error("Worker: Socket closed!"); stopWebsocketLoop() }
    if (socket.readyState == WebSocket.OPEN) {
      if (buffer.length > 0) {
        //console.log(buffer[0])
        let larr = new Uint8Array(5 + buffer[0].arr.length * 4)
        larr[0] = '0'
        //console.log(`Sending ${buffer[0].freq}`)
        larr[1] = (buffer[0].freq & 0xFF000000) >> 24
        larr[2] = (buffer[0].freq & 0x00FF0000) >> 16
        larr[3] = (buffer[0].freq & 0x0000FF00) >> 8
        larr[4] = (buffer[0].freq & 0x000000FF) >> 0
        const u8 = new Uint8Array(buffer[0].arr.buffer)
        larr.set(u8, 5)
        socket.send(larr)
        buffer.shift()
      } else if (toReset) {
        socket.send(new Uint8Array([2]))
        toReset = false
        console.log("Reset")
      }
    }
  }, (512000 / 44100) * 0.97)
}

function stopWebsocketLoop() { clearInterval(sloop) }

async function stressTest() {
  const smil = new Date().getTime()
  let iterc = 0
  const f32 = new Float32Array(520 * 4)
  console.log("Start update")
  let cs = 0

  let inn = setInterval(() => {
    const cmil = new Date().getTime()
    if (cmil - smil > cs * 1000) { console.log(`Reached ${cs} ${cmil} ${smil} ${iterc} ${iterc/cs}`); cs += 1; }
    if (cmil - smil > 4000) { clearInterval(inn) }
    socket.send(f32)
    ++iterc
  }, 1)

  console.log(`Update in 4s ${iterc/4}`)
}

async function parseBackendResponse(data) {
  let ab = await data.arrayBuffer()
  const f32 = new Float32Array(ab)
  //console.log(`Got backedn res ${f32[20]}`)
  postMessage(f32)
}

let rloop;
async function startReadingLoop() {
  await waiter(() => { return socket.readyState == WebSocket.OPEN } )
  console.log("STARTED READING")
  socket.send(new Uint8Array([1, 0, 10, 0, 0]))
  socket.onmessage = (event) => {parseBackendResponse(event.data)}
}
async function startReadingLoopSpec(freq) {
  await waiter(() => { return socket.readyState == WebSocket.OPEN } )
  console.log("STARTED READING")
  const message = new Uint8Array(9)
  message[0] = 3

  message[1] = (freq[0] & 0xFF000000) >> 24
  message[2] = (freq[0] & 0x00FF0000) >> 16
  message[3] = (freq[0] & 0x0000FF00) >> 8
  message[4] = (freq[0] & 0x000000FF) >> 0

  message[5] = (freq[1] & 0xFF000000) >> 24
  message[6] = (freq[1] & 0x00FF0000) >> 16
  message[7] = (freq[1] & 0x0000FF00) >> 8
  message[8] = (freq[1] & 0x000000FF) >> 0

  socket.send(message)
  socket.onmessage = (event) => {parseBackendResponse(event.data)}
}
function stopReadingLoop() { clearInterval(rloop) }

onmessage = (e) => {
  //console.log(`Worker log: ${e.data['type']}`)
  if (e.data['type'] == 'data') {
    buffer.push(e.data['data'])
    //socket = e.data['socket']
  } else if (e.data['type'] == 'startStream') {
    console.log("AAAAAAAAAAAAAAAAA")
    startWebsocketLoop()
  } else if (e.data['type'] == 'stopStream') {
    stopWebsocketLoop()
  } else if (e.data['type'] == 'startReading') {
    startReadingLoop()
  } else if (e.data['type'] == 'startSpec') {
    startReadingLoopSpec(e.data['freq'])
  } else if (e.data['type'] == 'stopReading') {
    stopReadingLoop()
    socket.close()
    startSocket()
  } else if (e.data['type'] == 'reset') {
    buffer = []
    socket.send(new Uint8Array([2]))
    console.log("Reset")
  } else if (e.data['type'] == 'stress') {
    stressTest()
  }
}

