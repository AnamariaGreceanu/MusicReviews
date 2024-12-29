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
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
}
</style>
