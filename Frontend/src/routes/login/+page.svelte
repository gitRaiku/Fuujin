<script>
  let username = "";
  let password = "";

  function handleLogin() {
    console.log("Logging in:", username, password);
    // Add authentication logic here
  }
</script>

<div class="login-container">
  <h2>Login</h2>
  <input type="text" bind:value={username} placeholder="Username" />
  <input type="password" bind:value={password} placeholder="Password" />
  <button on:click={handleLogin}>Login</button>
</div>

<style>
  .login-container {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  input, button {
    display: block;
    width: 100%;
    margin: 0.5rem 0;
  }
</style>
