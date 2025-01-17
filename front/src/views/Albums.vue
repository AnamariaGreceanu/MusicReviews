<template>
  <Navbar></Navbar>
  <div class="card-container">
    <div v-for="(album, index) in albums" :key="index" class="album-card-item">
      <AlbumCard :album="album" />
    </div>
  </div>
</template>

<script>
import AlbumCard from "@/components/AlbumCard.vue";
import Navbar from "@/components/Navbar.vue";
import axios from "axios";

export default {
  name: "AlbumsView",
  components: {
    Navbar,
    AlbumCard,
  },
  data() {
    return {
      userId: this.$store.state.userId,
      token: localStorage.getItem("token"),
      albums: [],
    };
  },
  mounted() {
    axios
      .get("http://localhost:8000/api/albums/getAllAlbums", {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((res) => {
        this.albums = res.data;
      })
      .catch((err) => {
        this.$vaToast.init({
          message: "Failed to load the albums. Try again",
          color: "danger",
        });
        console.error("Error fetching albums:", err);
      });
  },
};
</script>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
}

.album-card-item {
  max-width: 400px;
  box-sizing: border-box;
}
</style>
