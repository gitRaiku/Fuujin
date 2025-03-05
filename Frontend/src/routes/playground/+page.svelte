<style>
  canvas {
    height: 100%;
    width: 100%;
  }

  :global(button.buttonSelected) {
    color: black;
    background: white;
  }
</style>


<div class="flex flex-col justify-start items-center w-full h-full">
  <div class="flex flex-col items-center justify-center h-[80%] w-full mt-20">
    <div id="controls" class="w-[80%] h-auto p-3  gap-x-5 flex flex-row items-center justify-center">
      <button class="text-center text-xl w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_start" >Start sim</button>
      <button class="text-center text-xl w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_stop" >Stop sim</button>
    </div>

    <div class="border border-2 border-ghost w-[80%] h-[20%]" id='canvasDiv'><canvas id="spectrumCanvas" class="w-[100%] object-fill"></canvas></div>
    <div class="w-[80%] h-[80%] border border-t-0 border-2 border-ghost"><canvas id="canvas"></canvas></div>

    <div id="controls" class="w-[80%] h-auto p-3  gap-x-5 flex flex-row items-center justify-center">
      <button class="text-center text-m w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_addr">Adder Node</button>
      <button class="text-center text-m w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_mult">Multiplier Node</button>
      <button class="text-center text-m w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_cnst">Constant Node</button>
      <button class="text-center text-m w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_audi">Audio Node</button>
      <button class="text-center text-m w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_ante">Transmitter Node</button>
      <button class="text-center text-m w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_osci">Oscillator Node</button>
      <button class="text-center text-m w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_recv">Reciever Node</button>
      <button class="text-center text-m w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_plyr">Player Node</button>
      <button class="text-center text-m w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_upco">Upconverter Node</button>
      <button class="text-center text-m w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_copy">Copy Node</button>
    </div>
  </div>
</div>

<script>
  import "../../app.css";
  import { onMount, onDestroy } from 'svelte';
  import { Spectrum, spectrumOnMount } from './Spectrum.js';
  import { Playground, playgroundOnMount } from './Playground.js';

  let pl;
  let spec;
  function windowKeyDown(e) {
    if (pl != undefined) { pl.keydown(e) }
  }

  function windowOnchange(e) {
    if (pl != undefined) {
      pl.updateBounds(window.innerWidth, window.innerHeight); 
      pl.drawGraph()
    }
    if (spec != undefined) {
      spec.updateBounds(window.innerWidth, window.innerHeight);
      spec.update()
    }
  }

  onDestroy(() => {
    if (pl != null && pl != undefined) { pl.destroy() }
    if (spec != null && spec != undefined) { spec.destroy() }
    pl = undefined
    spec = undefined
  })

  onMount(() => {
    playgroundOnMount().then(() => {
      let nodeButtons = [
        document.getElementById("node_addr"),
        document.getElementById("node_mult"),
        document.getElementById("node_cnst"),
        document.getElementById("node_audi"),
        document.getElementById("node_ante"),
        document.getElementById("node_osci"),
        document.getElementById("node_recv"),
        document.getElementById("node_plyr"),
        document.getElementById("node_copy"),
        document.getElementById("node_upco"),
      ]

      const canvas = document.getElementById("canvas")

      pl = new Playground(canvas, nodeButtons)
      pl.updateBounds(window.innerWidth, window.innerHeight);
      window.pl = pl


      document.getElementById("node_start").addEventListener("click", (e) => {pl.startSimulation()})
      document.getElementById("node_stop").addEventListener("click", (e) => {pl.stopSimulation()})

      /*
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
        //for (let i = 0; i < 2000; ++i) {
          //pl.updateNodes()
        //}
        //pl.nodes[5].finish()
      })
      pl.drawGraph()*/

      canvas.addEventListener("mousedown", (event) => {pl.mouseDown(event.offsetX, event.offsetY)})
      canvas.addEventListener("mousemove", (event) => {pl.mouseMove(event.offsetX, event.offsetY)})
      canvas.addEventListener("mouseup", (event) => {pl.mouseUp(event.offsetX, event.offsetY)})

      for (const [i, node] of nodeButtons.entries()) {
        node.addEventListener("click", () => {
          for (const [li, lnode] of nodeButtons.entries()) {
            if (li != i) { lnode.classList.remove("buttonSelected") }
          }
          node.classList.add("buttonSelected")
          pl.nextNodeType = i
        })
      }
      })
    spectrumOnMount().then(() => {
      const canvas = document.getElementById("spectrumCanvas");
      spec = new Spectrum(canvas)
      spec.updateBounds(window.innerWidth, window.innerHeight);
      spec.update()
    })
  });
</script>

<svelte:window on:keydown={windowKeyDown} on:resize={windowOnchange} on:scroll={windowOnchange}/>
