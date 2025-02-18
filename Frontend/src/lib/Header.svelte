<script>
  import { onMount } from "svelte";

  let scrolled = false;

  onMount(() => {
    window.addEventListener("scroll", () => {
      scrolled = window.scrollY > 10;
    });
  });
</script>

<header class={scrolled ? "scrolled" : ""}>
  <h1 class="logo">Fuujin</h1>

  <nav>
    <a href="/playground">Playground</a>
    <a href="/learn">Learn</a>
    <a href="/login">Login</a>
  </nav>
</header>

<style>
  header {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2.5rem;
    background: rgba(0, 0, 0); /* Semi-transparent background */
    color: white;
    transition: all 0.3s;
  }

  header.scrolled {
    background: black; /* Solid black when scrolling */
  }

  .logo {
    font-size: 1.8rem;
    font-weight: bold;
  }

  nav {
    display: flex;
    gap: 1.5rem;
  }

  nav a {
    text-decoration: none;
    color: white;
    font-size: 1.2rem;
    transition: 0.2s;
  }

  nav a:hover {
    color: #ffcc00;
  }

  /* Responsive for small screens */
  @media (max-width: 600px) {
    header {
      flex-direction: column;
      text-align: center;
    }

    nav {
      margin-top: 0.5rem;
    }
  }
</style>

