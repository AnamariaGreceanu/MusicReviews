import { createRouter, createWebHashHistory } from "vue-router";
import LoginView from "../views/Login.vue";
import RegisterView from "../views/Register.vue";
import AlbumsView from "../views/Albums.vue";
import FavouritesView from "../views/Favourites.vue";

const routes = [
  { path: "/login", name: "Login", component: LoginView },
  { path: "/register", name: "Register", component: RegisterView },
  { path: "/albums", name: "Albums", component: AlbumsView },
  { path: "/favourites", name: "Favourites", component: FavouritesView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
