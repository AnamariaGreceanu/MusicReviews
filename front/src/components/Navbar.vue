<template>
  <nav class="navbar">
    <router-link to="/albums">Albums</router-link> |
    <router-link to="/favourites">Favourites</router-link>
  </nav>
</template>

<script>
export default { name: "NavbarComponent" };
</script>
<style>
.navbar {
  padding: 30px;
  background-color: #222;
}

.navbar a {
  font-weight: bold;
  color: #2c3e50;
}

.navbar a.router-link-exact-active {
  color: #42b983;
}
</style>
