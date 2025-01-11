<template>
  <div class="container">
    <LoginForm />
  </div>
</template>

<script>
import LoginForm from "../components/LoginForm.vue";
export default {
  name: "LoginView",
  components: {
    LoginForm,
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #ad62c9;
}
</style>
