<template>
  <nav class="navbar">
    <div class="links">
      <router-link to="/albums">Albums</router-link> |
      <router-link to="/favourites">Favourites</router-link>
    </div>
    <button class="logout-button" @click="logout">Logout</button>
  </nav>
</template>

<script>
export default {
  name: "NavbarComponent",
  methods: {
    logout() {
      this.$store.commit("setToken", null);
      this.$store.commit("setUserId", null);
      this.$router.push("/login");
    },
  },
};
</script>
<style>
.navbar {
  padding: 30px;
  background-color: #222;
  display: flex;
  align-items: center;
}

.navbar a {
  font-weight: bold;
  color: #2c3e50;
}

.links {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.navbar a.router-link-exact-active {
  color: #42b983;
}

.logout-button {
  margin-left: auto;
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  font-weight: bold;
}

.logout-button:hover {
  background-color: #c0392b;
}
</style>
