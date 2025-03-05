<script context="module">
	const _expansionState = {/* treeNodeId: expanded <boolean> */}
</script>

<script>
	export let trees
	export let tree
	export let clicker
	export let isMainTree = true
  let label, children, page
  if (tree != undefined) {
    label = tree['label']
    children = tree['children']
    page = tree['page']
  } else {
    label = ""
    children = []
    page = ""
  }
  let expanded = _expansionState[label] || true
	const toggleExpansion = () => {
    expanded = _expansionState[label] = !expanded
  }

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  function doClick() { clicker(page) }
  $: rotateClass = expanded ? 'arrowDown' : ''
</script>

{#if trees}
{#each trees as tree}
<svelte:self trees={undefined} tree={tree} clicker={clicker}/>
{/each}
{:else}
<ul class="whitespace-nowrap text-ellipsis">
	<li class="whitespace-nowrap text-ellipsis">
		{#if children}
			<span on:click={toggleExpansion} class="hover:cursor-pointer">
        <span class="transition-transform duration-200 select-none whitespace-nowrap text-ellipsis">&#x25b6</span>
				{label}
			</span>
			{#if expanded}
				{#each children as child}
        <svelte:self trees={undefined} tree={child} clicker={clicker} isMainTree={false}/>
				{/each}
			{/if}
		{:else}
    <span on:click={doClick} class="hover:cursor-pointer hover:fg-hide transition-all">
				<span class="pl-5 whitespace-nowrap text-ellipsis"/>
				{label}
			</span>
		{/if}
	</li>
</ul>
{/if}

<!--
<style>
	.no-arrow { padding-left: 1.0rem; }
	.arrow {
		cursor: pointer;
		display: inline-block;
		transition: transform 200ms;
	}
	.arrowDown { transform: rotate(90deg); }
</style>
-->
