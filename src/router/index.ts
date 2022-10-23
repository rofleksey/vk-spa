import { createRouter, createWebHashHistory } from "vue-router";
import IntroView from "../views/IntroView.vue";
import { loadAccessToken, saveAccessToken } from "@/lib/localstorage";

const tokenRegex = /access_token=(.*?)&/;

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "intro",
      component: IntroView,
    },
    {
      path: "/list",
      name: "user list",
      component: () => import("../views/UserListView.vue"),
      beforeEnter: (to, from, next) => {
        if (!loadAccessToken()) {
          next({ path: "/" });
        } else next();
      },
    },
    {
      path: "/add",
      name: "add user",
      component: () => import("../views/AddUserView.vue"),
      beforeEnter: (to, from, next) => {
        if (!loadAccessToken()) {
          next({ path: "/" });
        } else next();
      },
    },
    {
      path: "/result",
      name: "result",
      component: () => import("../views/ResultView.vue"),
      beforeEnter: (to, from, next) => {
        if (!loadAccessToken()) {
          next({ path: "/" });
        } else next();
      },
    },
    {
      path: "/wall",
      name: "wall",
      component: () => import("../views/WallView.vue"),
      beforeEnter: (to, from, next) => {
        if (!loadAccessToken()) {
          next({ path: "/" });
        } else next();
      },
    },
  ],
});

router.beforeEach((to) => {
  const url = to.path?.toString() ?? "";
  if (url) {
    const match = tokenRegex.exec(url);
    if (match) {
      saveAccessToken(match[1]);
      return { path: "/list" };
    }
  }
});

export default router;
