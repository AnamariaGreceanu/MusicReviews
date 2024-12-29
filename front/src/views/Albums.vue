<template>
  <Navbar></Navbar>
  <div class="card-container">
    <div v-for="(album, index) in album" :key="index" class="album-card-item">
      <AlbumCard :album="album" />
    </div>
  </div>
</template>

<script>
import AlbumCard from "@/components/AlbumCard.vue";
import Navbar from "@/components/Navbar.vue";

export default {
  name: "AlbumsView",
  components: {
    Navbar,
    AlbumCard,
  },
  data() {
    return {
      album: [
        { name: "Album 1", artist: "Artist 1", image: "image1.jpg" },
        { name: "Album 2", artist: "Artist 2", image: "image2.jpg" },
        { name: "Album 3", artist: "Artist 3", image: "image3.jpg" },
        { name: "Album 4", artist: "Artist 4", image: "image4.jpg" },
        { name: "Album 5", artist: "Artist 5", image: "image5.jpg" },
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
