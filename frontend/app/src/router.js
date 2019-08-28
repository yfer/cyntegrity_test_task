import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Tasks from "./views/Tasks.vue";
import Pipelines from "./views/Pipelines.vue";
import Pipeline from "./views/Pipeline.vue";
import Login from "./views/Login.vue";
import auth from "./auth";

Vue.use(Router);

var router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      meta: { title: "Authentication  " },
      component: Login
    },
    {
      path: "/logout",
      name: "logout",
      beforeEnter(to, from, next) {
        auth.logout();
        next("/");
      }
    },
    {
      path: "/",
      name: "home",
      meta: { title: "Home" },
      component: Home
    },
    {
      path: "/about",
      name: "about",
      meta: { title: "About" },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/tasks",
      name: "tasks",
      meta: { requiresAuth: true, title: "Tasks" },
      component: Tasks
    },
    {
      path: "/pipelines",
      name: "pipelines",
      meta: { requiresAuth: true, title: "Pipelines" },
      component: Pipelines
    },
    {
      path: "/pipelines/:id",
      name: "pipeline",
      meta: { requiresAuth: true, title: "Pipeline" },
      component: Pipeline
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: "/login",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next(); // make sure to always call next()!
  }
});

export default router;
