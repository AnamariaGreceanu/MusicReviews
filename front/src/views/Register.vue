<template>
  <div class="container">
    <RegisterForm />
  </div>
</template>

<script>
import RegisterForm from "../components/RegisterForm.vue";
export default {
  name: "RegisterView",
  components: {
    RegisterForm,
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
