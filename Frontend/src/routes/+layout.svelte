<script>
    import "/src/app.css";
    import Footer from "$lib/Footer.svelte";
    import Header from "$lib/Header.svelte";
</script>

<header>
    <Header/>
</header>

<main class="bg-bg text-fg v-[100vw] h-[100vh]">
    <slot/>
</main>

<!--
<footer>
    <Footer/>
</footer>
-->
