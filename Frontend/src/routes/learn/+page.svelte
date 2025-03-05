<script>
  import TreeView from '/src/lib/TreeView.svelte'
	const trees = [
    {label: "Fuujin", children: [
      {label: "Descriere", page: "intro"},
      {label: "Tipurile de Noduri", page: "nodes"},
      {label: "Audio player simplu", page: "aplayer"},
      {label: "Controlul volumului", page: "avolplayer"},
      {label: "Eterul", page: "trans"},
      {label: "Playground", page: "plg"},
		]},
    {label: "Radio", children: [
      {label: "Ce este un semnal", page: "semnal"},
      {label: "Ce este un FFT", page: "fft"},
    ]}
	]

  import { page } from '$app/stores';
  import { writable } from 'svelte/store';
  import Intro from '/src/routes/learn/intro.svelte'

  let currentComponent = writable(Intro);

  async function loadPage(path) {
    const cpage = (await import(/* @vite-ignore */path)).default;
    currentComponent.set(cpage);
  }

  function clicker(name) {
    console.log(name)
    if (name != "") {
      loadPage(`/src/routes/learn/${name}.svelte`)
    }
  }
</script>

<div class="flex flex-row justify-start w-full h-full">
  <div class="p-3 min-w-60 max-w-60 h-[100%] border-r-2 border-ghost overflow-hidden">
  <TreeView trees={trees} {clicker}/>
  </div>

  <div class="p-8 w-full border-r-2 overflow-scroll border-ghost">
    {#if $currentComponent}
      <svelte:component this={$currentComponent} />
    {/if}
  </div>
</div>
