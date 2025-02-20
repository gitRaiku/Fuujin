<style>
  .playground-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    border: 2px solid green;
    padding: 10%;
    padding-top: 5%;
  }

  .playground {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10%;
    border: 3px solid white;
    height: 100%;
    width: 100%;
  }

  .plcanvas {
    width: 80%;
    height: 80%;
    border: 6px solid black;
  }

  .plbuttons {
    max-width: 80%;
    max-height: 20%;
    border: 2px solid purple;
  }

  canvas {
    height: 100%;
    width: 100%;
  }

  button {
    padding: 12px 20px;
    font-size: 16px;
    font-weight: bold;
    color: white;
    background: #007BFF; /* Primary color */
    border: 2px solid #0056b3; /* Darker border */
    border-radius: 0px;
    cursor: pointer;
    transition: background 0.3s, border-color 0.3s, transform 0.2s;
  }

  button:hover {
    background: #0056b3; /* Darker shade on hover */
    border-color: #004080;
    transform: scale(1.05); /* Slight pop effect */
  }

  button:active {
    background: #003d66; /* Even darker on click */
    transform: scale(0.98);
  }
</style>

<Header />

<div class="playground-top">
  <div class="playground">
    <div class="plcanvas"><canvas id="canvas"></canvas></div>

    <div id="controls" class="plbuttons">
      <button id="red">Red Node</button>
      <button id="blue">Blue Node</button>
      <button id="green">Green Node</button>
      <button id="yellow">Yellow Node</button>
      <button id="purple">Purple Node</button>
      <button id="upload">Upload Audio</button>
      <input type="file" id="audioFile" accept="audio/*" style="display: none;">
    </div>
  </div>
</div>


<script>
  import Header from "$lib/Header.svelte";
  import { onMount } from 'svelte';

  import { Playground } from './Playground.js';
  
  let pl;

  onMount(() => {
    const canvas = document.getElementById("canvas");
    pl = new Playground(canvas);
    pl.updateBounds(window.innerWidth, window.innerHeight);

    // canvas.addEventListener("click", (event) => {pl.onClick(event.offsetX, event.offsetY)})
    canvas.addEventListener("mousedown", (event) => {pl.mouseDown(event.offsetX, event.offsetY)})
    canvas.addEventListener("mousemove", (event) => {pl.mouseMove(event.offsetX, event.offsetY)})
    canvas.addEventListener("mouseup", (event) => {pl.mouseUp(event.offsetX, event.offsetY)})

    window.addEventListener("resize", () => {pl.updateBounds(window.innerWidth, window.innerHeight); pl.drawGraph()})

    document.getElementById("upload").addEventListener("click", () => {document.getElementById("audioFile").click()})
    document.getElementById("audioFile").addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const audio = new Audio(URL.createObjectURL(file));
        audio.play();
        console.log("Playing:", file.name);
      }
    });
    
  });
</script>

