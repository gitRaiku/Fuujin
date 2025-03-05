<div class="flex flex-row items-center justify-center">
  <div class="max-w-300 w-full">
    <div class="text-6xl font-bold mb-4 mt-10">Un prim player de audio</div>

    <div class="text-lg m-6">Pentru a creea cel mai simplu circuit functional in Fuujin, trebuie conectat direct un nod Audio catre un nod Player. Nodul audio va citi fisierul dat, fisier ce contine La Campanella de catre Franz Liszt, pornind astfel fluxul de audio</div>
    <div class="text-lg m-6">Totul e interactiv! Conecteaza nodul Audio cu cel Player si apasa pe <b>Start sim</b> pentru a incepe porni redarea!</div>

    <div class="flex flex-col items-center justify-center h-[100%] w-full mt-20">
      <div id="controls" class="w-[80%] h-auto p-3  gap-x-5 flex flex-row items-center justify-center">
        <button class="text-center text-xl w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_start" >Start sim</button>
        <button class="text-center text-xl w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_stop" >Stop sim</button>
        <button class="text-center text-xl w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_reload" >Reload sim</button>
      </div>
      <!--<div class="border border-2 border-ghost w-[80%] h-[20%]" id='canvasDiv'><canvas id="spectrumCanvas" class="w-[100%] object-fill"></canvas></div>-->
      <div class="w-[100%] h-120 border-2 border-ghost"><canvas id="canvas" class="w-[100%] h-[100%]"></canvas></div>
    </div>
    <div class="flex flex-column items-center justify-center min-h-20 mt-8">
      <div class="w-[30%] border text-center min-h-20 hover:border-primary hover:cursor-pointer rounded-md transition-all duration-200 mr-[40%]" on:click={clickBack}>
        <div class="flex flex-col items-left justify-left p-3">
          <div class="text-left item-center text-secondary">Pagina Trecuta</div>
          <div class="text-left item-center">Tipuri de noduri</div>
        </div>
      </div>

      <div class="w-[30%] border text-center min-h-20 hover:border-primary hover:cursor-pointer rounded-md transition-all duration-200" on:click={clickFw}>
        <div class="flex flex-col items-right justify-right p-3">
          <div class="text-right item-center text-secondary">Pagina Urmatoare</div>
          <div class="text-right item-center">Controlul Volumului</div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  export let clicker
  function clickBack() {clicker('nodes')}
  function clickFw() {clicker('avolplayer')}
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

  let json = '[{"pos":[0.4,0.6],"name":"Alege fisier audio","ntype":3,"conns":[],"data":{"audioPath":"/LaCampanella.m4a"}},{"pos":[0.7,0.6],"name":"Player","ntype":7,"conns":[]}]'

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
