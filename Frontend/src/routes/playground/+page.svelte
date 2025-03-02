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

  .speccanvas {
    width: 80%;
    height: 20%;
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
  
  :global(button.buttonSelected) {
    color: black;
    background: white;
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
    <div class="speccanvas"><canvas id="spectrumCanvas"></canvas></div>
    <div class="plcanvas"><canvas id="canvas"></canvas></div>

    <div id="controls" class="plbuttons">
      <button id="node_addr" class="buttonSelected">Adder Node</button>
      <button id="node_mult">Multiplier Node</button>
      <button id="node_cnst">Constant Node</button>
      <button id="node_audi">Audio Node</button>
      <button id="node_ante">Antenna Node</button>
      <button id="node_osci">Oscillator Node</button>
      <button id="node_run">Run Node</button>
      <button id="node_step">Step Node</button>
    </div>
  </div>
</div>

<script>
  import Header from "$lib/Header.svelte";
  import { onMount, onDestroy } from 'svelte';
  import { Spectrum, spectrumOnMount } from './Spectrum.js';
  import { Playground, playgroundOnMount } from './Playground.js';
  
  let pl;
  let spec;
  onDestroy(() => {
    if (pl != null && pl != undefined) { pl.destroy() }
    if (spec != null && spec != undefined) { spec.destroy() }
  })

  onMount(() => {
    /*
    playgroundOnMount().then(() => {
      let nodeButtons = [
        document.getElementById("node_addr"),
        document.getElementById("node_mult"),
        document.getElementById("node_cnst"),
        document.getElementById("node_audi"),
        document.getElementById("node_ante"),
        document.getElementById("node_osci"),
        document.getElementById("node_run")
      ]

      const canvas = document.getElementById("canvas"), 

      pl = new Playground(canvas, nodeButtons)
      pl.updateBounds(window.innerWidth, window.innerHeight);

      pl.addNode([0.1, 0.5], 3)
      pl.addNode([0.35, 0.5], 0)
      pl.addNode([0.35, 0.2], 2)
      pl.addNode([0.6, 0.5], 1)
      pl.addNode([0.6, 0.2], 2)
      pl.addNode([0.9, 0.5], 4)
      pl.addNode([0.1, 0.2], 5)
      if (1) {
        if (1) {
          pl.linkFacets([6, 0], [3, 1])
          pl.linkFacets([2, 0], [1, 0])
          pl.linkFacets([0, 0], [1, 1])
          pl.linkFacets([1, 2], [3, 0])
          // pl.linkFacets([4, 0], [3, 1])
          pl.linkFacets([3, 2], [5, 0])
          pl.nodes[2].constant = 0.0
          pl.nodes[4].constant = 1.0
          pl.nodes[6].freq = 2000.0
        } else {
          pl.linkFacets([0, 0], [1, 0])
          pl.linkFacets([2, 0], [1, 1])
          pl.linkFacets([1, 2], [3, 0])
          pl.linkFacets([4, 0], [3, 1])
          pl.linkFacets([3, 2], [5, 0])
          pl.nodes[2].constant = 0.0
          pl.nodes[4].constant = 1.0
        }
      } else {
        pl.linkFacets([0, 0], [5, 0])
      }
      pl.nodes[0].fetchDataFromLink('/src/lib/amirmi.wav').then( () => {
        for (let i = 0; i < 500; ++i) {
          pl.updateNodes()
        }
        //pl.nodes[5].finish()
      })
      pl.drawGraph()

      canvas.addEventListener("mousedown", (event) => {pl.mouseDown(event.offsetX, event.offsetY)})
      canvas.addEventListener("mousemove", (event) => {pl.mouseMove(event.offsetX, event.offsetY)})
      canvas.addEventListener("mouseup", (event) => {pl.mouseUp(event.offsetX, event.offsetY)})
      window.addEventListener("scroll", (event) => {pl.updateBounds(window.innerWidth, window.innerHeight); pl.drawGraph()})
      window.addEventListener("resize", () => {pl.updateBounds(window.innerWidth, window.innerHeight); pl.drawGraph()})

      for (const [i, node] of nodeButtons.entries()) {
        node.addEventListener("click", () => {
          for (const [li, lnode] of nodeButtons.entries()) {
            if (li != i) { lnode.classList.remove("buttonSelected") }
          }
          node.classList.add("buttonSelected")
          pl.nextNodeType = i
        })
      }
      document.getElementById('node_step').addEventListener('click', () => {pl.updateNodes()})
      })*/
    spectrumOnMount().then(() => {
      const canvas = document.getElementById("spectrumCanvas"), 
      spec = new Spectrum(canvas)
      spec.updateBounds(window.innerWidth, window.innerHeight);
      spec.update()

      window.addEventListener("scroll", (event) => {spec.updateBounds(window.innerWidth, window.innerHeight); spec.update()})
      window.addEventListener("resize", () => {spec.updateBounds(window.innerWidth, window.innerHeight); spec.update()})
    })
  });
</script>

