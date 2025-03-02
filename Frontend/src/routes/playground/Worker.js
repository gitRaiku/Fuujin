let socket;

async function startSocket() {
  socket = new WebSocket('ws://localhost:8080')
  socket.onmessage = (event) => {}
  socket.onopen = () => {console.log('Worker websocket opened')}
  socket.onclose = () => {console.log('WOrker websocket closed')}
  socket.onerror = (error) => {console.log(`Woeker websocket error ${error}`)}
}
startSocket()

async function stressTest() {
  const smil = new Date().getTime()
  let iterc = 0
  console.log("Start update")
  const f32 = new Float32Array(520);
  let cs = 0
  while (true) {
    const cmil = new Date().getTime()
    if (cmil - smil > cs * 1000) {
      console.log(`Reached ${cs} ${cmil} ${smil} ${iterc} ${iterc/cs}`)
      cs += 1
    }
    if (cmil - smil > 4000) { break }
    await socket.send(f32)
    //this.updateNodes()
    ++iterc
  }
  console.log(`Update in 4s ${iterc/4}`)
}

onmessage = (e) => {
  console.log(`Worker log: ${e.data}`)
  if (e.data['type'] == 'socket') {
    startSocket()
    //socket = e.data['socket']
  } else if (e.data['type'] == 'stress') {
    stressTest()
  }
  postMessage('Pula calului');
};

