<script>
  import { onMount, onDestroy } from 'svelte';
  import { Playground, playgroundOnMount } from '/src/routes/playground/Playground.js';

  function setupPlayground(id, str) {
    const canvas = document.getElementById(id)
    let pl = new Playground(canvas, [])
    pl.updateBounds(window.innerWidth, window.innerHeight);
    pl.fromSerial(str)
  }

  onMount(() => {
    setupPlayground('plaudio' , '[{"pos":[0.38,0.6],"name":"","ntype":3,"conns":[],"data":{"audioPath":""}}]')
    setupPlayground('plplay'  , '[{"pos":[0.38,0.6],"name":"","ntype":7,"conns":[],"data":{"audioPath":""}}]')
    setupPlayground('pltrans' , '[{"pos":[0.38,0.6],"name":"","ntype":4,"conns":[],"data":{"audioPath":""}}]')
    setupPlayground('plrecept', '[{"pos":[0.38,0.6],"name":"","ntype":5,"conns":[],"data":{"freq":"0"}}]')
    setupPlayground('plosc'   , '[{"pos":[0.38,0.6],"name":"","ntype":10,"conns":[],"data":{"freq":"0"}}]')
    setupPlayground('pladd'   , '[{"pos":[0.38,0.6],"name":"","ntype":0,"conns":[],"data":{"freq":"0"}}]')
    setupPlayground('plmult'  , '[{"pos":[0.38,0.6],"name":"","ntype":1,"conns":[],"data":{"freq":"0"}}]')
    setupPlayground('plconst' , '[{"pos":[0.38,0.6],"name":"","ntype":2,"conns":[],"data":{"freq":"0"}}]')
    setupPlayground('plcop'   , '[{"pos":[0.38,0.6],"name":"","ntype":8,"conns":[],"data":{"freq":"0"}}]')
  })
</script>
<div class="flex flex-row items-center justify-center">
  <div class="max-w-300 w-full">
    <div class="text-6xl font-bold mb-4 w-full">Toate tipurile de noduri</div>

    <div class="text-lg mb-6 w-full">
      In Fuujin se afla un numar de noduri ce te ajuta a prelua un semnal audio si a-l procesa pana in punctul in care ajunge ori pe eterul radio, ori in boxe spre a fi auzit.
    </div>

    <div class="text-6xl font-bold mb-4">Nodul Audio</div>
    <div class="flex flex-row mb-6">
      <div class="w-60 h-50 border-2 border-ghost"><canvas id="plaudio"></canvas></div>
      <div class="text-lg m-6">Nodul Audio este unul dintre cele mai importante noduri, acesta citind un fisier audio selectat, permitand astfel fluxul audioului prin noduri succesive. </div>
    </div>

    <div class="text-6xl font-bold mb-4">Nodul Player</div>
    <div class="flex flex-row mb-6">
      <div class="w-60 h-50 border-2 border-ghost"><canvas id="plplay"></canvas></div>
      <div class="text-lg m-6">Nodul Player permite fluxului audio sa fie redirectionat catre boxele utilizatorului, aducand informatiile pur digitale intr-o forma fizica pentru a putea fi auzite. </div>
    </div>

    <div class="text-6xl font-bold mb-4">Nodul Transmitator</div>
    <div class="flex flex-row mb-6">
      <div class="w-60 h-50 border-2 border-ghost"><canvas id="pltrans"></canvas></div>
      <div class="text-lg m-6">Nodul Transmitator permite fluxului audio sa fie transmis pe eterul radio, limitat totusi pana la frecventa maxima de 20KHz, frecventa ce pica in banda VLF.
      </div>
    </div>

    <div class="text-6xl font-bold mb-4">Nodul Receptor</div>
    <div class="flex flex-row mb-6">
      <div class="w-60 h-50 border-2 border-ghost"><canvas id="plrecept"></canvas></div>
      <div class="text-lg m-6">Nodul Receptor capteaza radiata radio emisa pe eter, transformand-o intr-un flux pentru a fi procesat de alte noduri.
      </div>
    </div>

    <div class="text-6xl font-bold mb-4">Nodul Oscilator</div>
    <div class="flex flex-row mb-6">
      <div class="w-60 h-50 border-2 border-ghost"><canvas id="plosc"></canvas></div>
      <div class="text-lg m-6">Nodul Oscilator genereaza un ton perfect la o frecventa specifica, acesta este folositor pentru a fi inmultit cu alte semnale, deschizand portile procesarii moderne de semnale.
      </div>
    </div>

    <div class="text-6xl font-bold mb-4">Nodul Adunator</div>
    <div class="flex flex-row mb-6">
      <div class="w-60 h-50 border-2 border-ghost"><canvas id="pladd"></canvas></div>
      <div class="text-lg m-6">Nodul Adunator preia doua fluxuri, adunandu-le. Acesta e folositor in momentul in care este necesara combinarea a mai multor semnale intr-unul, in general pentru transmitere sau redare.
      </div>
    </div>

    <div class="text-6xl font-bold mb-4">Nodul Inmultitor</div>
    <div class="flex flex-row mb-6">
      <div class="w-60 h-50 border-2 border-ghost"><canvas id="plmult"></canvas></div>
      <div class="text-lg m-6">Nodul Inmultitor preia doua fluxuri, inmultindu-le. Acesta e folosit pentru a putea procesa si codifica mesaje pentru a putea fi transmise mai favorabil pe eter.
      </div>
    </div>

    <div class="text-6xl font-bold mb-4">Nodul Constant</div>
    <div class="flex flex-row mb-6">
      <div class="w-60 h-50 border-2 border-ghost"><canvas id="plconst"></canvas></div>
      <div class="text-lg m-6">Nodul Constant genereaza o valuare constanta ce poate fi folosita pentru a polariza un semnal intr-o directie dorita, sau pentru a amplifica un semnal.
      </div>
    </div>

    <div class="text-6xl font-bold mb-4">Nodul Copiator</div>
    <div class="flex flex-row mb-6">
      <div class="w-60 h-50 border-2 border-ghost"><canvas id="plcop"></canvas></div>
      <div class="text-lg m-6">Nodul Copiator preia un flux, impartindu-l in doua, pentru a putea fi transmis pe doua cai simultan, cum ar fi pe eter si catre boxe.
      </div>
    </div>


  </div>
</div>

