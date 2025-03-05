<script>
  import TreeView from '/src/lib/TreeView.svelte'
	const trees = [
    {label: "Fuujin", children: [
      {label: "Intro", page: "intro"},
      {label: "What is radio", page: "radio"},
		]},
    {label: "Nodes", children: [
      {label: "Audio Node", page: "audionode"},
      {label: "Adder Node", page: "addernode"},
      {label: "Multiplier Node"},
      {label: "Oscillator Node"},
      {label: "Upconverter Node"},
      {label: "Transciever Nodes"},
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
  <div class="p-3 min-w-60 max-w-60 border border-2 border-ghost overflow-hidden">
  <TreeView trees={trees} {clicker}/>
  </div>

  <div class="p-3 w-full border border-2 border-ghost">
    {#if $currentComponent}
      <svelte:component this={$currentComponent} />
    {/if}
  </div>
</div>
