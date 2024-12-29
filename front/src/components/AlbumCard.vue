<template>
  <div class="album-card">
    <va-card>
      <div class="card-content">
        <div class="left-section">
          <h3>{{ album.name }}</h3>
          <p class="album-artist">By {{ album.artist }}</p>
          <img :src="album.image" alt="Album Cover" class="album-photo" />
        </div>

        <div class="right-section">
          <h4>Reviews</h4>
          <va-button size="small" @click="openModal">Add Review</va-button>
          <div class="reviews" ref="reviewsContainer">
            <div v-for="(review, index) in reviews" :key="index" class="review">
              <p>
                <strong>{{ review.author }}</strong>
                <i
                  v-if="review.liked"
                  class="pi pi-thumbs-up"
                  style="font-size: 1.5rem; margin: 0 5px"
                ></i>
                <i
                  v-else
                  class="pi pi-thumbs-down"
                  style="font-size: 1.5rem; margin: 0 5px"
                ></i>

                : {{ review.content }}
              </p>
              <va-button
                v-if="review.authorId === userId"
                size="small"
                class="edit-btn"
                @click="editReview(review.id)"
              >
                Edit
              </va-button>
              <va-button
                v-if="review.authorId === userId"
                size="small"
                color="danger"
                @click="deleteReview(review.id)"
              >
                Delete
              </va-button>
            </div>
            <div v-if="loading" class="loading">Loading more reviews...</div>
            <div v-if="reviews.length === 0" class="no-reviews">
              No reviews yet.
            </div>
          </div>
        </div>
      </div>
    </va-card>
    <va-modal
      v-model="isModalOpen"
      title="Add a Review"
      @cancel="closeModal"
      @ok="addReview"
      ok-text="Submit"
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
export default {
  name: "AlbumCard",
  props: {
    album: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      reviews: [],
      loading: false,
      userId: "user123",
      isModalOpen: false,
      newReviewContent: "",
      newReviewLiked: true,
    };
  },
  methods: {
    loadReviews() {
      const newReviews = [
        {
          id: 1,
          author: "John",
          content: "Amazing album!",
          liked: true,
          authorId: "user456",
        },
        {
          id: 2,
          author: "Jane",
          content: "Loved the rhythm!",
          liked: false,
          authorId: "user123",
        },
        {
          id: 2,
          author: "Jane",
          liked: false,
          content: "Loved the rhythm!",
          authorId: "user123",
        },
        {
          id: 2,
          author: "Jane",
          liked: true,
          content: "Loved the rhythm!",
          authorId: "user123",
        },
      ];

      this.reviews = newReviews;
    },
    openModal() {
      this.isModalOpen = true;
    },
    toggleLike() {
      this.newReviewLiked = !this.newReviewLiked;
    },
    addReview() {
      if (this.newReviewContent.trim() === "") {
        alert("Review content cant be empty.");
        return;
      }

      this.reviews.push({
        id: Date.now(),
        author: "Me",
        content: this.newReviewContent,
        liked: this.newReviewLiked,
        authorId: this.userId,
      });

      this.newReviewContent = "";
      this.newReviewLiked = false;
      this.isModalOpen = false;
    },
    editReview(reviewId) {
      console.log(`Edit review ${reviewId}`);
    },
    deleteReview(reviewId) {
      this.reviews = this.reviews.filter((review) => review.id !== reviewId);
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
  gap: 2rem;
}

.left-section {
  display: flex;
  align-items: center;
  display: block;
  margin: 10px;
  flex: 2;
}

.album-photo {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
}

.album-artist {
  color: gray;
  margin: 10px;
}

.right-section {
  flex: 3;
}

.reviews {
  height: 200px;
  overflow-y: auto;
  border: 1px solid #eaeaea;
  padding: 1rem;
  margin: 5px;
  border-radius: 8px;
}

.review {
  margin-bottom: 1rem;
}

.edit-btn {
  margin-right: 0.5rem;
}

.loading {
  text-align: center;
  margin-top: 1rem;
  color: gray;
}
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}
</style>
