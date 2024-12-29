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
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
}
</style>
