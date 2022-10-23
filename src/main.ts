import { createApp } from "vue";
import { createPinia } from "pinia";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
// @ts-ignore
import VueVirtualScroller from "vue-virtual-scroller";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueVirtualScroller);

app.mount("#app");
