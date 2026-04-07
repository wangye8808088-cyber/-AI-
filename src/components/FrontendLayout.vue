<template>
  <div class="frontend-layout">
    <div class="navbar-container">
      <div class="brand-section">
        <el-image
          style="width: 50px; height: 50px"
          :src="iconUrl"
          alt="品牌logo"
          class="brand-logo"
        />
        <h1 class="brand-name">心理健康AI助手</h1>
      </div>
      <div class="nav-section">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/consulation" class="nav-link" v-if="isLoggedIn"
          >AI咨询</router-link
        >
        <router-link to="/emotion-diary" class="nav-link" v-if="isLoggedIn"
          >情绪日记</router-link
        >
        <router-link to="/knowledge" class="nav-link">知识库</router-link>
        <button class="logout-btn" v-if="isLoggedIn" @click="handleLogout">
          退出登录
        </button>
        <template v-else>
          <router-link to="/auth/login" class="nav-link">登录</router-link>
          <router-link to="/auth/register" class="nav-link">
            <el-button type="primary">注册</el-button>
          </router-link>
        </template>
      </div>
    </div>
    <div class="main-content">
      <router-view></router-view>
    </div>
    <div class="footer-container">
      <div class="footer-bottom">
        <p>&copy; 2026 心理健康AI助手. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { logout } from "@/api/admin";
import { useRouter } from "vue-router";

const router = useRouter();

const iconUrl = new URL("@/assets/images/机器人.png", import.meta.url).href;

const isLoggedIn = ref(false);

// 登出
const handleLogout = () => {
  logout().then(() => {
    // 清除缓存
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    // 跳转到登录页面
    router.push("/auth/login");
  });
};

onMounted(() => {
  isLoggedIn.value = localStorage.getItem("token") !== null;
});
</script>

<style scoped lang="scss">
.frontend-layout {
  min-height: 100vh;
  background: var(--hs-bg);
  display: flex;
  flex-direction: column;

  .navbar-container {
    max-width: 1200px;
    margin: 18px auto 0;
    padding: 10px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--hs-card);
    border-radius: var(--hs-radius-pill);
    box-shadow: var(--hs-shadow-soft);
    gap: 32px;

    .brand-section {
      display: flex;
      align-items: center;

      .brand-logo {
        border-radius: 18px;
        box-shadow: var(--hs-shadow-soft);
      }

      .brand-name {
        margin-left: 12px;
        font-size: 22px;
        font-weight: 700;
        letter-spacing: 0.2px;
        color: var(--hs-text-primary);
      }
    }

    .nav-section {
      display: flex;
      align-items: center;
      gap: 24px;

      .nav-link {
        color: var(--hs-text-secondary);
        font-size: 16px;
        font-weight: 500;
        padding: 8px 16px;
        border-radius: var(--hs-radius-pill);
        transition: background-color 0.2s ease, color 0.2s ease,
          box-shadow 0.2s ease;

        &:hover {
          color: var(--hs-text-primary);
          background-color: var(--hs-primary-soft);
          box-shadow: var(--hs-shadow-soft);
        }
      }

      .logout-btn {
        background: #fffaf3;
        border: 1px solid var(--hs-border-subtle);
        border-radius: var(--hs-radius-pill);
        color: var(--hs-text-secondary);
        font-size: 14px;
        font-weight: 500;
        padding: 8px 18px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: var(--hs-primary-soft);
          color: var(--hs-primary);
          border-color: rgba(47, 107, 255, 0.3);
        }
      }

      :deep(.el-button) {
        border-radius: var(--hs-radius-pill);
        padding: 8px 20px;
        font-weight: 600;
        box-shadow: var(--hs-shadow-soft);
      }
    }
  }

  .main-content {
    flex: 1;
  }

  .footer-container {
    background: transparent;
    color: var(--hs-text-secondary);
    padding: 24px 0 16px;
    margin-top: auto;

    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 10px;
      text-align: center;
      font-size: 13px;
      border-top: 1px solid var(--hs-border-subtle);
      padding-top: 16px;
    }
  }
}
</style>
