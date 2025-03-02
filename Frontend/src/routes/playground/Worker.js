let socket;
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function waiter(func) { while (!func()) { await sleep(100) } }

async function startSocket() {
  socket = new WebSocket('ws://localhost:8080')
  socket.onmessage = (event) => {}
  socket.onopen = () => {console.log('Worker websocket opened')}
  socket.onclose = () => {console.log('WOrker websocket closed')}
  socket.onerror = (error) => {console.log(`Woeker websocket error ${error}`)}
}
startSocket()

let buffer = []

let sloop;
function startWebsocketLoop() {
  sloop = setInterval(() => {
    if (socket.readyState == WebSocket.CLOSED || socket.readyState == WebSocket.CLOSING) { console.error("Worker: Socket closed!"); stopWebsocketLoop() }
    if (socket.readyState == WebSocket.OPEN && buffer.length > 0) {
      let larr = new Uint8Array(5 + buffer[0].arr.length * 4)

      console.log("Sending backedn res")
      larr[0] = '0'
      larr[1] = 0
      larr[2] = 10
      larr[3] = 0
      larr[4] = 0
      const u8 = new Uint8Array(buffer[0].arr.buffer)
      larr.set(u8, 5)
      socket.send(larr)
      buffer.shift()
    }
  }, 1)
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
  console.log(`Got backedn res ${f32[20]}`)
  postMessage(f32)
}

let rloop;
async function startReadingLoop() {
  await waiter(() => { return socket.readyState == WebSocket.OPEN } )
  socket.send(new Uint8Array([1, 0, 10, 0, 0]))
  socket.onmessage = (event) => {parseBackendResponse(event.data)}
}
function stopReadingLoop() { clearInterval(rloop) }

onmessage = (e) => {
  //console.log(`Worker log: ${e.data}`)
  if (e.data['type'] == 'data') {
    buffer.push(e.data['data'])
    //socket = e.data['socket']
  } else if (e.data['type'] == 'startStream') {
    startWebsocketLoop()
  } else if (e.data['type'] == 'stopStream') {
    stopWebsocketLoop()
  } else if (e.data['type'] == 'startReading') {
    startReadingLoop()
  } else if (e.data['type'] == 'stopReading') {
    stopReadingLoop()
    socket.close()
    startSocket()
  } else if (e.data['type'] == 'stress') {
    stressTest()
  }
}

