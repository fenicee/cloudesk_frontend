import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
import VirtualReality from "../views/VirtualReality.vue";
import RTL from "../views/Rtl.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";
import store from "@/store";
import axios from "axios";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/dashboard-default",
    meta: { requiresAuth: true },

  },
  {
    path: "/dashboard-default",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },

  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
    meta: { requiresAuth: true },

  },
  {
    path: "/billing",
    name: "Billing",
    component: Billing,
    meta: { requiresAuth: true },

  },
  {
    path: "/virtual-reality",
    name: "Virtual Reality",
    component: VirtualReality,
    meta: { requiresAuth: true },

  },
  {
    path: "/rtl-page",
    name: "RTL",
    component: RTL,
    meta: { requiresAuth: true },

  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true },

  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});
router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters['auth/isLoggedIn'];
  if (isLoggedIn) {
    // 如果已登录，则确保axios请求头包含JWT Token
    ensureAxiosToken();
  }
  if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
    // 如果未登录且试图访问需要登录的页面，则跳转到登录页
    next('/signin');
  } else if (to.path === '/signin' && isLoggedIn) {
    // 如果已登录且试图访问登录页，则跳转到主页
    next('/dashboard-default');
  } else {
    next();
  }
});
// 确保axios请求头包含JWT Token的函数
function ensureAxiosToken() {
  const jwt = store.getters['auth/jwt'];
  if (jwt) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}

export default router;
