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
      f32[i] = Math.sin(((i + 90 / (180 * 2 / 512)) / 512 * 3.1415 * 2 * 0.9) * mult)
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
      var out = fft.forward(ri)
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
