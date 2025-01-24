<template>
  <Navbar></Navbar>
  <div class="card-container">
    <div v-for="(album, index) in albums" :key="index" class="album-card-item">
      <AlbumCard
        :album="album"
        :is-favourite="isFavourite"
        @add-favourite="addToFavourites"
        @remove-favourite="removeFromFavourites"
      />
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
      favourites: [],
    };
  },
  mounted() {
    this.loadAlbums();
    this.loadFavourites();
  },
  methods: {
    isFavourite(albumName) {
      return this.favourites.some((fav) => fav.albumName === albumName);
    },

    addToFavourites(albumId) {
      axios
        .post(
          `http://localhost:8000/api/users/addAlbumToFavourites/${albumId}`,
          {},
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        )
        .then((res) => {
          this.loadFavourites();
          this.$vaToast.init({
            message: res.data.message,
            color: "success",
          });
        })
        .catch((err) =>
          this.$vaToast.init({
            message:
              err.response.data.message ||
              "Couldn't be added to favourites. Try again.",
            color: "danger",
          })
        );
    },

    removeFromFavourites(albumName) {
      const toBeDeleted = this.favourites.find(
        (fav) => fav.albumName === albumName
      );
      axios
        .delete(
          `http://localhost:8000/api/users/removeFromFavourites/${toBeDeleted.favouriteId}`,
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        )
        .then((res) => {
          this.favourites = this.favourites.filter(
            (fav) => fav.albumName !== albumName
          );
          this.$vaToast.init({
            message: res.data.message,
            color: "warning",
          });
        })
        .catch((err) =>
          this.$vaToast.init({
            message:
              err.response.data.message ||
              "Couldn't be removed from favourites. Try again.",
            color: "danger",
          })
        );
    },

    loadAlbums() {
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

    loadFavourites() {
      axios
        .get("http://localhost:8000/api/users/getFavouriteAlbums", {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((res) => {
          this.favourites = res.data;
        })
        .catch((err) => {
          this.$vaToast.init({
            message: "Failed to load the favourites. Try again",
            color: "danger",
          });
          console.error("Error fetching albums:", err);
        });
    },
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
