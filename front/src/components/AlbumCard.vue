<template>
  <div class="album-card">
    <va-card>
      <div class="card-content">
        <div class="left-section">
          <h3>{{ album.albumName }}</h3>
          <p class="album-artist">By {{ album.artist }}</p>
          <img :src="album.photoAlbum" alt="Album Cover" class="album-photo" />
        </div>
        <div class="right-section">
          <h4>Reviews</h4>
          <div class="albums-options">
            <va-button size="small" @click="openModal" class="custom-button"
              >Add Review</va-button
            >
            <va-button
              v-if="!isFavouritePage"
              icon
              @click="toggleFavourite"
              :color="isFavourite(album.albumName) ? 'warning' : 'transparent'"
              size="small"
            >
              <i
                :class="
                  isFavourite(album.albumName)
                    ? 'pi pi-star-fill'
                    : 'pi pi-star'
                "
                style="font-size: 1.3rem"
              ></i>
            </va-button>
            <va-button
              v-if="isFavouritePage"
              icon
              :color="'warning'"
              size="small"
              @click="removeFromFavourites"
            >
              <i :class="'pi pi-star-fill'" style="font-size: 1.3rem"></i>
            </va-button>
          </div>

          <div class="reviews" ref="reviewsContainer">
            <div v-for="(review, index) in reviews" :key="index" class="review">
              <p>
                <strong>{{ review.username }}</strong>
                <i
                  v-if="review.isLiked"
                  class="pi pi-thumbs-up"
                  style="font-size: 1.3rem; margin-left: 5px"
                ></i>
                <i
                  v-else
                  class="pi pi-thumbs-down"
                  style="font-size: 1.3rem; margin-left: 5px"
                ></i>

                {{ review.review }}
              </p>
              <div class="button-userOptions">
                <va-button
                  v-if="review.userId === userId"
                  size="small"
                  @click="editReview(review.reviewId)"
                  class="custom-button"
                >
                  Edit
                </va-button>
                <va-button
                  v-if="review.userId === userId"
                  size="small"
                  color="danger"
                  class="custom-button"
                  @click="deleteReview(review.reviewId)"
                >
                  Delete
                </va-button>
              </div>
            </div>
            <div v-if="loading" class="loading">Loading more reviews...</div>
            <div v-if="!loading && reviews.length === 0" class="no-reviews">
              No reviews yet.
            </div>
          </div>
        </div>
      </div>
    </va-card>
    <va-modal
      v-model="isModalOpen"
      :title="isEditMode ? 'Edit Review' : 'Add a Review'"
      @ok="isEditMode ? updateReview() : addReview()"
      :ok-text="isEditMode ? 'Update' : 'Submit'"
    >
      <div class="modal-content">
        <va-input
          v-model="newReviewContent"
          placeholder="Write your comment..."
        />
        <div class="modal-actions">
          <va-button @click="toggleLike">
            <i
              v-if="newReviewLiked"
              class="pi pi-thumbs-up"
              style="font-size: 1.5rem"
            ></i>
            <i v-else class="pi pi-thumbs-down" style="font-size: 1.5rem"></i>
          </va-button>
        </div>
      </div>
    </va-modal>
  </div>
</template>

<script>
import "primeicons/primeicons.css";
import axios from "axios";

export default {
  name: "AlbumCard",
  props: {
    album: {
      type: Object,
      required: true,
    },
    isFavouritePage: {
      type: Boolean,
      default: false,
    },
    isFavourite: {
      type: Function,
    },
  },
  data() {
    return {
      reviews: [],
      loading: false,
      userId: this.$store.state.userId,
      isModalOpen: false,
      isEditMode: false,
      currentReviewId: null,
      newReviewContent: "",
      newReviewLiked: true,
      token: this.$store.state.token,
    };
  },
  methods: {
    loadReviews() {
      this.loading = true;
      axios
        .get(
          `http://localhost:8000/api/reviews/getReviewsByAlbumId/${this.album.albumId}`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        )
        .then((res) => {
          this.reviews = res.data;
        })
        .catch((err) => {
          this.$vaToast.init({
            message: err.response.data.message || "Reviews couldn't be loaded",
            color: "danger",
          });
          console.error("Error fetching reviews:", err);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    openModal() {
      this.isModalOpen = true;
      this.isEditMode = false;
      this.newReviewContent = "";
      this.newReviewLiked = true;
    },

    toggleLike() {
      this.newReviewLiked = !this.newReviewLiked;
    },

    editReview(reviewId) {
      const review = this.reviews.find((r) => r.reviewId === reviewId);
      if (review) {
        this.isEditMode = true;
        this.currentReviewId = reviewId;
        this.newReviewContent = review.review;
        this.newReviewLiked = review.isLiked;
        this.isModalOpen = true;
      }
    },

    addReview() {
      if (this.newReviewContent.trim() === "") {
        this.$vaToast.init({
          message: "Review can't be empty",
          color: "danger",
        });
        return;
      }
      const newReview = {
        review: this.newReviewContent,
        isLiked: this.newReviewLiked,
      };

      axios
        .post(
          `http://localhost:8000/api/reviews/addReview/${this.album.albumId}`,
          newReview,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        )
        .then((res) => {
          this.reviews.push(res.data.newReview);
          this.$vaToast.init({
            message: res.data.message,
            color: "success",
          });
          this.newReviewContent = "";
          this.newReviewLiked = false;
          this.isModalOpen = false;
        })
        .catch((err) => {
          this.$vaToast.init({
            message:
              err.response.data.message ||
              "Failed to add the review. Please try again",
            color: "danger",
          });
          console.error("Error adding review:", err);
        });
    },

    updateReview() {
      if (this.newReviewContent.trim() === "") {
        this.$vaToast.init({
          message: "Review can't be empty",
          color: "danger",
        });
        return;
      }
      const newReview = {
        review: this.newReviewContent,
        isLiked: this.newReviewLiked,
      };

      axios
        .put(
          `http://localhost:8000/api/reviews/${this.album.albumId}/${this.currentReviewId}`,
          newReview,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        )
        .then((res) => {
          const index = this.reviews.findIndex(
            (review) => review.reviewId === this.currentReviewId
          );
          if (index !== -1) {
            this.reviews[index].review = this.newReviewContent;
            this.reviews[index].isLiked = this.newReviewLiked;
          }
          this.isModalOpen = false;
          this.$vaToast.init({
            message: res.data.message,
            color: "success",
          });
        })
        .catch((err) => {
          this.$vaToast.init({
            message:
              err.response.data.message ||
              "Failed to update the review. Please try again",
            color: "danger",
          });
          console.error("Error updating review:", err);
        });
    },

    deleteReview(reviewId) {
      axios
        .delete(
          `http://localhost:8000/api/reviews/${this.album.albumId}/${reviewId}`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        )
        .then((res) => {
          this.reviews = this.reviews.filter(
            (review) => review.reviewId !== reviewId
          );
          this.$vaToast.init({
            message: res.data.message,
            color: "success",
          });
        })
        .catch((err) => {
          console.error("Error deleting review:", err);
          this.$vaToast.init({
            message: err.response.data.message || "Review deleted successfully",
            color: "success",
          });
        });
    },

    toggleFavourite() {
      if (this.isFavourite(this.album.albumName)) {
        this.$emit("remove-favourite", this.album.albumName);
      } else {
        this.$emit("add-favourite", this.album.albumId);
      }
    },
    removeFromFavourites() {
      this.$emit("removeFromFavourites", this.album.albumName);
    },
  },

  mounted() {
    this.loadReviews();
  },
};
</script>

<style scoped>
.album-card {
  max-width: 800px;
  margin: auto;
  padding: 1rem;
}

.card-content {
  display: flex;
  gap: 1rem;
  padding: 15px;

  .left-section {
    display: flex;
    align-items: center;
    flex-direction: column;
    flex: 2;

    h3 {
      min-height: 50px;
      align-items: center;
      display: flex;
    }
    .album-photo {
      width: 120px;
      height: 120px;
      border-radius: 8px;
      margin: 10px;
    }

    .album-artist {
      color: gray;
      margin-top: 5px;
      text-align: center;
      font-size: 0.9rem;
    }
  }

  .right-section {
    flex: 3;

    h4 {
      margin-bottom: 10px;
    }
    .albums-options {
      justify-content: center;
      display: flex;
      gap: 0.5rem;
    }
    .custom-button {
      border-radius: 8px !important;
    }
    .reviews {
      margin-top: 10px;
      height: 200px;
      overflow-y: auto;
      border: 1px solid #dbc3c3;
      padding: 0.5rem;
      border-radius: 8px;
      width: 180px;
      .review {
        margin-bottom: 1rem;
        .button-userOptions {
          justify-content: center;
          display: flex;
          gap: 0.5rem;
          margin-top: 3px;
        }
      }
      .loading {
        text-align: center;
        margin-top: 1rem;
        color: gray;
      }
    }
  }
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .modal-actions {
    display: flex;
    justify-content: space-between;
  }
}
</style>
