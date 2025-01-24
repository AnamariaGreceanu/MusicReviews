<template>
  <Navbar></Navbar>
  <div v-if="loading" class="card-container">Loading your favourites...</div>
  <div v-else-if="albums.length === 0" class="card-container">
    You have no album added to favourites yet. Please return to the albums
    section and add one of your choice.
  </div>
  <div v-else class="card-container">
    <div v-for="(album, index) in albums" :key="index" class="album-card-item">
      <AlbumCard
        :album="album"
        :isFavouritePage="true"
        @removeFromFavourites="removeFromFavourites"
      />
    </div>
  </div>
</template>

<script>
import AlbumCard from "../components/AlbumCard.vue";
import Navbar from "@/components/Navbar.vue";
import axios from "axios";

export default {
  name: "FavouritesView",
  components: {
    Navbar,
    AlbumCard,
  },
  data() {
    return {
      albums: [],
      userId: this.$store.state.userId,
      token: this.$store.state.token,
      loading: true,
    };
  },
  mounted() {
    if (!this.token) {
      this.$router.push("/login");
    } else {
      this.loadFavourites();
    }
  },
  methods: {
    removeFromFavourites(albumName) {
      const toBeDeleted = this.albums.find(
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
          this.albums = this.albums.filter(
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

    loadFavourites() {
      this.loading = true;
      axios
        .get("http://localhost:8000/api/users/getFavouriteAlbums", {
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
                "Failed to load the favourites. Try again",
              color: "danger",
            });
            console.error("Error fetching albums:", err);
          }
        })
        .finally(() => {
          this.loading = false;
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
