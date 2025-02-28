<script>
  import { onMount } from "svelte";
  let username = "";
  let password = "";

  function handleLogin() {
    console.log("Logging in:", username, password);
    // Add authentication logic here
  }

  import { KissFFT, KissFFTR, loadKissFFT } from '/src/routes/login/KissFFTLoader.js'

  function inputReals(size, mult) {
    var f32 = new Float32Array(size)
    for (var i = 0; i < size; ++i) {
      if (i < 128 || i > 512 - 128) {
        f32[i] = 0.0
        //f32[i] = Math.sin(((i + 0 / 16) / 512 * 3.1415 * 2 * 4) * mult)
      } else {
        f32[i] = Math.random()
        //f32[i] = Math.sin(((i + 0 / 16) / 512 * 3.1415 * 2 * 4) * mult)
      }
      //f32[i] = Math.sin(((i + 0 / 16) / 512 * 3.1415 * 2 * 0.5) * mult)
    }
    return f32
  }

  function multiplySignal(size, s1, s2) {
    var f32 = new Float32Array(size)
    for (var i = 0; i < size; ++i) {
      f32[i] = s1[i] + s2[i]
    }
    return f32
  }

  onMount(() => {
    loadKissFFT().then(() => {
      var fft = new KissFFTR(512)

      var ri = inputReals(512, 1.0)
      const smil = new Date().getTime()
      let iterc = 0
      console.log("Start update")
      while (true) {
        const cmil = new Date().getTime()
        if (cmil - smil > 4000) { break }
        var out = fft.forward(ri)
        ++iterc
      }
      console.log(`Update in 4s ${iterc/4}`)
      var rev = fft.inverse(out)

      fft.dispose()

      const socket = new WebSocket('ws://localhost:8080')
      socket.onmessage = (event) => {
        console.log(`Received message: ${event.data}`)
      }
      socket.onopen = () => {
        console.log('Connected to the WebSocket server')
        socket.send('1')
        socket.send(ri)
        socket.send('0')
        socket.send('2')
        socket.send(out)
        socket.send('0')
        socket.send('1')
        socket.send(ri)
        socket.send('3')
        socket.send(rev)
        socket.send('0')
        //socket.send(outr)
      }
      socket.onclose = () => {
        console.log('Disconnected from the WebSocket server')
      }
      socket.onerror = (error) => {
        console.log(`Error occurred: ${error}`)
      }
    })
  })
</script>


<div class="login-container">
  <h2>Login</h2>
  <input type="text" bind:value={username} placeholder="Username" />
  <input type="password" bind:value={password} placeholder="Password" />
  <button on:click={handleLogin}>Login</button>
</div>

<style>
  .login-container {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  input, button {
    display: block;
    width: 100%;
    margin: 0.5rem 0;
  }
</style>
