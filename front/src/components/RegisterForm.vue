<template>
  <div class="register-container">
    <va-form>
      <va-input
        class="mb-4"
        label="Username"
        type="text"
        v-model="data.username"
      />
      <va-input class="mb-4" label="Email" type="email" v-model="data.email" />
      <va-input
        class="mb-4"
        label="Password"
        type="password"
        v-model="data.password"
      />
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
  name: "RegisterForm",
  data() {
    return {
      data: {
        password: "",
        email: "",
        username: "",
      },
    };
  },
  methods: {
    login: function () {
      this.$router.push("/login");
    },
    register: function () {
      axios
        .post("http://localhost:8000/api/users/register", this.data)
        .then(() => {
          this.$router.push("/");
        })
        .catch((err) =>
          this.$vaToast.init({
            message: err.response.data.message || "Register failed",
            color: "danger",
          })
        );
    },
  },
};
</script>

<style scoped>
.register-container {
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
