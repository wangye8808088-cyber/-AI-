import { createRouter, createWebHistory } from "vue-router";
import BackendLayout from "@/components/BackendLayout.vue";
import AuthLayout from "@/components/AuthLayout.vue";
import FrontendLayout from "@/components/FrontendLayout.vue";

// 路由配置
const backendRoutes = [
  {
    path: "/back",
    redirect: "/back/dashboard",
    component: BackendLayout,
    children: [
      {
        path: "dashboard",
        // () => import(...)：这是一个匿名函数，返回一个动态导入的 Promise。
        // 原理：只有当用户真正点击或访问 /dashboard 这个路径时，浏览器才会去下载并加载 dashboard.vue 这个文件的代码。
        component: () => import("@/views/dashboard.vue"),
        // meta 就像是路由的“标签”，你可以往里塞任何你想要的数据（标题、图标、权限需求、是否缓存等），然后在需要的地方把它读出来。
        meta: {
          title: "数据分析",
          // element-plus 图标
          icon: "PieChart",
        },
      },
      {
        path: "knowledge",
        component: () => import("@/views/knowledge.vue"),
        meta: {
          title: "知识文章",
          icon: "ChatLineSquare",
        },
      },
      {
        path: "consultation",
        component: () => import("@/views/consultations.vue"),
        meta: {
          title: "咨询记录",
          icon: "Message",
        },
      },
      {
        path: "emotional",
        component: () => import("@/views/emotional.vue"),
        meta: {
          title: "情绪日志",
          icon: "User",
        },
      },
    ],
  },
  {
    path: "/auth",
    // 同步加载
    component: AuthLayout,
    children: [
      {
        path: "login",
        // 懒加载
        component: () => import("@/views/login.vue"),
        meta: {
          title: "登录",
        },
      },
      {
        path: "register",
        component: () => import("@/views/register.vue"),
        meta: {
          title: "注册",
        },
      },
    ],
  },
];

const frontendRoutes = [
  {
    path: "/",
    component: FrontendLayout,
    children: [
      {
        path: "",
        component: () => import("@/views/home.vue"),
      },
      {
        path: "consulation",
        component: () => import("@/views/consultation.vue"),
      },
      {
        path: "emotion-diary",
        component: () => import("@/views/emotionDiary.vue"),
      },
      {
        path: "knowledge",
        component: () => import("@/views/frontendKnowledge.vue"),
      },
      {
        path: "knowledge/article/:id",
        component: () => import("@/views/articleDetail.vue"),
        props: true,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...backendRoutes, ...frontendRoutes],
});

// 路由前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  // 当前用户是否登录
  if (token) {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // 如果是访问后台页面，那么直接放行
    if (userInfo.userType == 2) {
      if (to.path.startsWith("/back")) {
        next();
      } else {
        next("/back/dashboard");
      }
    } else if (userInfo.userType == 1) {
      // 用户端账号只能访问前台的路由
      if (to.path.startsWith("/back") || to.path.startsWith("/auth")) {
        next("/");
      } else {
        next();
      }
    }
  } else {
    if (to.path.startsWith("/back")) {
      // 如果是访问后台页面，那么跳转到登录页
      next("/auth/login");
    } else {
      next();
    }
  }
});

export default router;
