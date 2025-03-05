<script>
  import TreeView from '/src/lib/TreeView.svelte'
	const trees = [
    {label: "Fuujin", children: [
      {label: "Intro", page: "intro"},
      {label: "Nodurile Fuujin", page: "nodes"},
      {label: "Audio player simplu", page: "aplayer"},
		]},
    {label: "Radio", children: [
      {label: "Cum merge radioul", page: "radio"},
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

  <div class="p-3 w-full border-r-2 overflow-scroll border-ghost">
    {#if $currentComponent}
      <svelte:component this={$currentComponent} />
    {/if}
  </div>
</div>
