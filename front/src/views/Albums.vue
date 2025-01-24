<template>
  <Navbar></Navbar>
  <div v-if="loading" class="card-container">Loading albums...</div>
  <div v-else-if="albums.length === 0" class="card-container">
    No albums yet. We'll add them later.
  </div>
  <div v-else class="card-container">
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
      token: this.$store.state.token,
      albums: [],
      favourites: [],
      loading: true,
    };
  },
  mounted() {
    if (!this.token) {
      this.$router.push("/login");
    } else {
      this.loadAlbums();
      this.loadFavourites();
    }
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
      this.loading = true;
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
          if (err.response.status === 401 || err.response.status === 403) {
            this.$vaToast.init({
              message: "Your session may be expired. Try to login again",
              color: "danger",
            });
            this.$router.push("/login");
          } else if (err.response.status !== 404) {
            this.$vaToast.init({
              message:
                err.response.data.message ||
                "Failed to load the albums. Try again",
              color: "danger",
            });
            console.error("Error fetching albums:", err);
          }
        })
        .finally(() => {
          this.loading = false;
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
          if (err.response.status !== 404) {
            this.$vaToast.init({
              message:
                err.response.data.message ||
                "Failed to load the favourites. Try again",
              color: "danger",
            });
            console.error("Error fetching albums:", err);
          }
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
