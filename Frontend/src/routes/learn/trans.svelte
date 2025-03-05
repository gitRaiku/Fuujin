<div class="flex flex-row items-center justify-center">
  <div class="max-w-300 w-full">
    <div class="text-6xl font-bold mb-4 mt-10">Eterul radio</div>

    <div class="text-lg m-6">Desi e interesant sa te joci cu totul la tine acasa, puterea radioului vine in distanta pe care o poate parcurge prin eter, un cuvand intortochiat ce semnifica aerul</div>
    <div class="text-lg m-6">Pentru a transmite semnale altora, acestea trebuie conectate la un transmitator, fiind apoi receptate de un receptor pe partea opusa.</div>
    <div class="text-lg m-6">Conecteaza audio-ul la transmitator si vezi cum este redat de receptor, doar ai grija sa nu interferezi cu semnalele altora!</div>
 
    <div class="flex flex-row items-center justify-center h-[100%] w-[100%]">
      <div class="flex flex-col items-center justify-center h-[100%] w-[50%] mr-[5%] mt-20">
        <div class="w-[80%] h-auto p-3  gap-x-5 flex flex-row items-center justify-center">
          <button class="text-center text-xl w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_start1" >Start sim</button>
          <button class="text-center text-xl w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_stop1" >Stop sim</button>
          <button class="text-center text-xl w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_reload1" >Reload sim</button>
        </div>
        <div class="border border-2 border-ghost w-[100%] max-h-40"><canvas id="spectrumCanvas1" class="w-[100%] max-h-40 object-fill"></canvas></div>
        <div class="w-[100%] h-120 border-2 border-ghost"><canvas id="canvas1" class="w-[100%] h-[100%]"></canvas></div>
      </div>
      <div class="flex flex-col items-center justify-center h-[100%] w-[30%] ml-[5%]  mt-20">
        <div class="w-[80%] h-auto p-3  gap-x-5 flex flex-row items-center justify-center">
          <button class="text-center text-xl w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_start2" >Start sim</button>
          <button class="text-center text-xl w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_stop2" >Stop sim</button>
          <button class="text-center text-xl w-auto bg-ghostbg border border-2 border-ghost p-5 pr-9 pl-9 rounded-lg hover:cursor-pointer hover:bg-secondary transition-all" id="node_reload2" >Reload sim</button>
        </div>
        <div class="border border-2 border-ghost w-[100%] max-h-40"><canvas id="spectrumCanvas2" class="w-[100%] max-h-40 object-fill"></canvas></div>
        <div class="w-[100%] h-120 border-2 border-ghost"><canvas id="canvas2" class="w-[100%] h-[100%]"></canvas></div>
      </div>
    </div>
  </div>
</div>

<script>
  import { onMount, onDestroy } from 'svelte';
  import { Playground, playgroundOnMount } from '/src/routes/playground/Playground.js';
  import { Spectrum, spectrumOnMount } from '/src/routes/playground/Spectrum.js';

  let pl1, spec1;
  let pl2, spec2;
  function windowOnchange(e) {
    if (pl1 != undefined) {
      pl1.updateBounds(window.innerWidth, window.innerHeight); 
      pl1.drawGraph()
    }
    if (pl2 != undefined) {
      pl2.updateBounds(window.innerWidth, window.innerHeight); 
      pl2.drawGraph()
    }
  }

  onDestroy(() => {
    if (pl1 != null && pl1 != undefined) { pl1.destroy() } pl1 = undefined; 
    if (spec1 != undefined) { spec1.updateBounds(window.innerWidth, window.innerHeight); spec1.update() }
    if (pl2 != null && pl2 != undefined) { pl2.destroy() } pl2 = undefined; 
    if (spec2 != undefined) { spec2.updateBounds(window.innerWidth, window.innerHeight); spec2.update() }
  })
  function windowKeyDown(e) {
    if (pl1 != undefined) { pl1.keydown(e) }
    if (pl2 != undefined) { pl2.keydown(e) }
  }

  let json1 = '[{"pos":[0.16,0.38],"name":"Audio","ntype":3,"conns":[[0,[2,1]]],"data":{"audioPath":"/VivaldiNo3.m4a"}},{"pos":[0.15,0.77],"name":"Constant","ntype":2,"conns":[[0,[2,0]]],"data":{"constant":1}},{"pos":[0.52,0.57],"name":"Inmultitor","ntype":1,"conns":[[2,[3,0]]]},{"pos":[0.86,0.57],"name":"Transmitator","ntype":4,"conns":[]}]'

  let json2 = '[{"pos":[0.2,0.57],"name":"Receptor","ntype":5,"conns":[[0,[1,0]]]},{"pos":[0.8,0.57],"name":"Player","ntype":7,"conns":[]}]'

  onMount(() => {
    playgroundOnMount().then(() => {
      const canvas1 = document.getElementById('canvas1')
      pl1 = new Playground(canvas1, [])
      pl1.updateBounds(window.innerWidth, window.innerHeight);
      pl1.fromSerial(json1)

      canvas1.addEventListener("mousedown", (event) => {pl1.mouseDown(event.offsetX, event.offsetY)})
      canvas1.addEventListener("mousemove", (event) => {pl1.mouseMove(event.offsetX, event.offsetY)})
      canvas1.addEventListener("mouseup", (event) => {pl1.mouseUp(event.offsetX, event.offsetY)})

      document.getElementById("node_start1").addEventListener("click", (e) => {pl1.startSimulation()})
      document.getElementById("node_stop1").addEventListener("click", (e) => {pl1.stopSimulation()})
      document.getElementById("node_reload1").addEventListener("click", (e) => {pl1.stopSimulation(); pl1.fromSerial(json1)})

      const canvas2 = document.getElementById('canvas2')
      pl2 = new Playground(canvas2, [])
      pl2.updateBounds(window.innerWidth, window.innerHeight);
      pl2.fromSerial(json2)

      canvas2.addEventListener("mousedown", (event) => {pl2.mouseDown(event.offsetX, event.offsetY)})
      canvas2.addEventListener("mousemove", (event) => {pl2.mouseMove(event.offsetX, event.offsetY)})
      canvas2.addEventListener("mouseup", (event) => {pl2.mouseUp(event.offsetX, event.offsetY)})

      document.getElementById("node_start2").addEventListener("click", (e) => {pl2.startSimulation()})
      document.getElementById("node_stop2").addEventListener("click", (e) => {pl2.stopSimulation()})
      document.getElementById("node_reload2").addEventListener("click", (e) => {pl2.stopSimulation(); pl2.fromSerial(json2)})
    })

    spectrumOnMount().then(() => {
      const canvas1 = document.getElementById("spectrumCanvas1");
      spec1 = new Spectrum(canvas1)
      spec1.updateBounds(window.innerWidth, window.innerHeight);
      spec1.update()

      const canvas2 = document.getElementById("spectrumCanvas2");
      spec2 = new Spectrum(canvas2)
      spec2.updateBounds(window.innerWidth, window.innerHeight);
      spec2.update()
    })
  })


</script>
<svelte:window on:keydown={windowKeyDown} on:resize={windowOnchange} on:scroll={windowOnchange}/>
