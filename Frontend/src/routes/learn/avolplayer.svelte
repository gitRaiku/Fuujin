<div class="flex flex-row items-center justify-center">
  <div class="max-w-300 w-full">
    <div class="text-6xl font-bold mb-4 mt-10">Timpul sa adaugam volum!</div>

    <div class="text-lg m-6">Acum, vom lua fluxul nodului Audio si il vom inmulti cu o valuare constanta, pentru a ridica volumul, faceti click pe nodul Constant si schimbati valoarea emisa.</div>
    <div class="text-lg m-6">Cum inmultirea cu numere negative nu schimba frecventele componente in semnal, acesta se va auzi la fel inversat!</div>

    <div class="flex flex-col items-center justify-center h-[100%] w-full mt-20">
      <div id="controls" class="w-[80%] h-auto p-3  gap-x-5 flex flex-row items-center justify-center">
        <button class="text-center text-xl w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_start" >Start sim</button>
        <button class="text-center text-xl w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_stop" >Stop sim</button>
        <button class="text-center text-xl w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_reload" >Reload sim</button>
      </div>
      <!--<div class="border border-2 border-ghost w-[80%] h-[20%]" id='canvasDiv'><canvas id="spectrumCanvas" class="w-[100%] object-fill"></canvas></div>-->
      <div class="w-[100%] h-120 border-2 border-ghost"><canvas id="canvas" class="w-[100%] h-[100%]"></canvas></div>
    </div>
  </div>
</div>

<script>
  import { onMount, onDestroy } from 'svelte';
  import { Playground, playgroundOnMount } from '/src/routes/playground/Playground.js';
  import { Spectrum, spectrumOnMount } from '/src/routes/playground/Spectrum.js';

  let pl, spec;
  function windowOnchange(e) {
    if (pl != undefined) {
      pl.updateBounds(window.innerWidth, window.innerHeight); 
      pl.drawGraph()
    }
  }

  onDestroy(() => {
    if (pl != null && pl != undefined) { pl.destroy() } pl = undefined; 
    if (spec != undefined) { spec.updateBounds(window.innerWidth, window.innerHeight); spec.update() }
  })
  function windowKeyDown(e) {if (pl != undefined) { pl.keydown(e) }}

  let json = '[{"pos":[0.2,0.33],"name":"Audio","ntype":3,"conns":[[0,[2,1]]],"data":{"audioPath":"/LaCampanella.m4a"}},{"pos":[0.2,0.77],"name":"Constant","ntype":2,"conns":[[0,[2,0]]],"data":{"constant":0}},{"pos":[0.50,0.55],"name":"Inmultitor","ntype":1,"conns":[[2,[3,0]]]},{"pos":[0.8,0.55],"name":"Player","ntype":7,"conns":[]}]'

  onMount(() => {
    const canvas = document.getElementById('canvas')
    pl = new Playground(canvas, [])
    pl.updateBounds(window.innerWidth, window.innerHeight);
    pl.fromSerial(json)

    canvas.addEventListener("mousedown", (event) => {pl.mouseDown(event.offsetX, event.offsetY)})
    canvas.addEventListener("mousemove", (event) => {pl.mouseMove(event.offsetX, event.offsetY)})
    canvas.addEventListener("mouseup", (event) => {pl.mouseUp(event.offsetX, event.offsetY)})

    document.getElementById("node_start").addEventListener("click", (e) => {pl.startSimulation()})
    document.getElementById("node_stop").addEventListener("click", (e) => {pl.stopSimulation()})
    document.getElementById("node_reload").addEventListener("click", (e) => {pl.stopSimulation(); pl.fromSerial(json)})
  })

  /*
  spectrumOnMount().then(() => {
    const canvas = document.getElementById("spectrumCanvas");
    spec = new Spectrum(canvas)
    spec.updateBounds(window.innerWidth, window.innerHeight);
    spec.update()
  })
  */

</script>
<svelte:window on:keydown={windowKeyDown} on:resize={windowOnchange} on:scroll={windowOnchange}/>
