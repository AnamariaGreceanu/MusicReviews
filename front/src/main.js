import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { createVuestic } from "vuestic-ui";
import "vuestic-ui/dist/vuestic-ui.css";

createApp(App).use(createVuestic()).use(store).use(router).mount("#app");
