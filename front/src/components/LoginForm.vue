<template>
  <div class="login-container">
    <va-form>
      <div>
        <va-input
          class="mb-4"
          label="Email"
          type="email"
          v-model="data.email"
        />
        <va-input
          class="mb-4"
          label="Password"
          type="password"
          v-model="data.password"
        />
      </div>
      <div class="form-buttons">
        <va-button class="button" @click="login"> Login </va-button>
        <va-button class="button" @click="register"> Register </va-button>
      </div>
    </va-form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginForm",
  data() {
    return {
      data: {
        password: "",
        email: "",
      },
    };
  },
  methods: {
    register: function () {
      this.$router.push("/register");
    },
    login: function () {
      axios
        .post("http://localhost:8000/api/users/login", this.data)
        .then((res) => {
          localStorage.setItem("token", res.data.accessToken);
          this.$store.commit("setUserId", res.data.user.id);
          this.$router.push("/albums");
        })
        .catch((err) =>
          this.$vaToast.init({
            message: err.response.data.message || "Login failed",
            color: "danger",
          })
        );
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-buttons {
  display: flex;
  justify-content: space-between;
}

.button {
  width: 45%;
  text-align: center;
}
</style>
