<template>
  <Navbar></Navbar>
  <div class="card-container">
    <div v-for="(album, index) in albums" :key="index" class="album-card-item">
      <AlbumCard :album="album" />
    </div>
  </div>
</template>

<script>
import AlbumCard from "../components/AlbumCard.vue";
import Navbar from "@/components/Navbar.vue";

export default {
  name: "FavouritesView",
  components: {
    Navbar,
    AlbumCard,
  },
  data() {
    return {
      albums: [
        { name: "album 1", artist: "Artist 1", image: "image1.jpg" },
        { name: "album 3", artist: "Artist 3", image: "image3.jpg" },
        { name: "album 5", artist: "Artist 5", image: "image5.jpg" },
      ],
    };
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
