<script>
  import { onMount } from "svelte";

  let scrolled = false;

  onMount(() => {
    window.addEventListener("scroll", () => {
      scrolled = window.scrollY > 10;
    });
  });
</script>

<header class={`text-fg p-3 pl-5 pr-5 flex flex-row items-center justify-between ${scrolled ? "scrolled" : ""}`}>
  <a href="/" class="bg-ghost p-2 pl-5 pr-5 font-black text-xl rounded-md hover:text-primary transition-all">ඞ Fuujin</a>

  <nav class="flex flex-row items-center justify-center gap-x-5 text-xl p-2  pr-4 pl-4 bg-ghost rounded-md">
    <a class="hover:font-bold hover:text-secondary transition-all" href="/playground">Playground</a>
    <a class="hover:font-bold hover:text-secondary transition-all" href="/learn">Learn</a>
    <a class="hover:font-bold hover:text-secondary transition-all" href="/login">Login</a>
  </nav>
</header>

<style>
</style>

