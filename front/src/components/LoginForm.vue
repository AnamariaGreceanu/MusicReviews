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
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  margin-top: 20px;
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
