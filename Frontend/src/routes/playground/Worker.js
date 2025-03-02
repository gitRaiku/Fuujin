//let socket;

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function waiter(func) {
  while (!func()) {
    await sleep(100)
  }

  /*
  return await new Promise(resolve => {
    if (func()) { 
      resolve() 
    } else {
      setTimeout(waiter(func), 100)
    }
  })
  */
}

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
      console.log(`Worker: Sending Buffer ${buffer.length}`)
      socket.send(buffer[0].arr)
      buffer.shift()
    }
  }, 1)
}

function stopWebsocketLoop() { clearInterval(sloop) }
async function stressTest() {
  const smil = new Date().getTime()
  let iterc = 0
  const f32 = new Float32Array(520 * 4);
  console.log("Start update")
  let cs = 0

  let inn = setInterval(() => {
    const cmil = new Date().getTime()
    if (cmil - smil > cs * 1000) {console.log(`Reached ${cs} ${cmil} ${smil} ${iterc} ${iterc/cs}`); cs += 1; }
    if (cmil - smil > 4000) { clearInterval(inn) }
    socket.send(f32)
    ++iterc
  }, 1)

  console.log(`Update in 4s ${iterc/4}`)
}

let rloop;
async function startReadingLoop() {
  await waiter(() => {socket.state != WebSocket.OPENING})
  socket.send(new Uint8Array([1, 0, 10, 0, 0]))
  socket.onmessage = (event) => {
    console.log(`Got mes ${event.data}`)
  }
  /*
  rloop = setInterval(() => {
    if (socket.readyState == WebSocket.CLOSED || socket.readyState == WebSocket.CLOSING) { console.error("Worker: Socket closed!"); stopReadingLoop() }
    if (socket.readyState == WebSocket.OPEN) {
      socket.
      socket.send(buffer[0].arr)
      buffer.shift()
    }
  }, 1)*/
}
function stopReadingLoop() { clearInterval(rloop) }

onmessage = (e) => {
  console.log(`Worker log: ${e.data}`)
  if (e.data['type'] == 'data') {
    buffer.push(e.data['data'])
    //socket = e.data['socket']
  } else if (e.data['type'] == 'startStream') {
    startWebsocketLoop()
  } else if (e.data['type'] == 'stopStream') {
    stopWebsocketLoop()
  } else if (e.data['type'] == 'startReading') {
    startReadingLoop()
  } else if (e.data['type'] == 'stress') {
    stressTest()
  }
};

