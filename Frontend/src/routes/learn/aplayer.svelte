<script>
  import { onMount, onDestroy } from 'svelte';
  import { Playground, playgroundOnMount } from '/src/routes/playground/Playground.js';

  onMount(() => {
    const canvas = document.getElementById('canvas')
    let pl = new Playground(canvas, [])
    pl.updateBounds(window.innerWidth, window.innerHeight);
    pl.fromSerial('[{"pos":[0.5,0.6],"name":"Alege fisier audio","ntype":3,"conns":[[0,[1,0]]],"data":{"audioPath":""}},{"pos":[1.7,0.4536401074560005],"name":"Player","ntype":7,"conns":[]}]')
  })
</script>
<div class="flex flex-row items-center justify-center">
  <div class="max-w-300 w-full">
    <div class="text-6xl font-bold mb-4">Receptor audio</div>
      <div class="w-80% h-60 border-2 border-ghost"><canvas id="canvas"></canvas></div>
      <div class="text-lg m-6">Nodul Player permite fluxului audio sa fie redirectionat catre boxele utilizatorului, aducand informatiile pur digitale intr-o forma fizica pentru a putea fi auzite. </div>
  </div>
</div>


