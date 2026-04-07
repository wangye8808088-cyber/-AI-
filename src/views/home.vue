<template>
  <div class="home-container">
    <div class="content">
      <div class="text">
        <h2 class="title">
          一次温暖的对话<br />
          <span class="highlight-text">化孤独为慰藉</span>
        </h2>
        <p class="description">
          每个深夜，每个焦虑时刻，我们都在这里。不必独自承受，让心与心的链接温暖您的每一天
        </p>
        <div class="hero-actions">
          <el-button size="large">开始倾诉，获得陪伴</el-button>
          <el-button size="large" style="border-color: #fff" color="transparent"
            >记录心情，释放感情</el-button
          >
        </div>
      </div>
      <div class="robot">
        <el-image
          class="robot-image"
          style="width: 150px; height: 150px"
          :src="iconUrl"
          alt="机器人"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const iconUrl = new URL("@/assets/images/机器人.png", import.meta.url).href;
</script>

<style scoped lang="scss">
.home-container {
  min-height: calc(100vh - 140px);
  padding: 56px 0 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 12% 20%, rgba(255, 214, 77, 0.32), transparent 45%),
    radial-gradient(circle at 88% 80%, rgba(255, 199, 222, 0.4), transparent 40%),
    var(--hs-bg);

  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
    max-width: 1080px;
    width: 100%;
    padding: 40px 48px;
    border-radius: var(--hs-radius-xl);
    background-color: var(--hs-surface);
    box-shadow: var(--hs-shadow-card);

    .text {
      width: 520px;

      .title {
        font-size: clamp(34px, 4vw, 44px);
        font-weight: 800;
        line-height: 1.2;
        margin-bottom: 18px;
        color: var(--hs-text-primary);

        .highlight-text {
          color: var(--hs-accent-orange);
        }
      }

      .description {
        font-size: 16px;
        line-height: 1.7;
        color: var(--hs-text-secondary);
        max-width: 460px;
      }

      .hero-actions {
        margin-top: 28px;
        display: flex;
        gap: 14px;

        :deep(.el-button) {
          border-radius: var(--hs-radius-pill);
          padding: 0 26px;
          height: 46px;
          font-weight: 600;
          box-shadow: var(--hs-shadow-soft);
        }

        :deep(.el-button:nth-child(1)) {
          background-color: var(--hs-primary);
          border: none;
          color: #ffffff;
        }

        :deep(.el-button:nth-child(2)) {
          background-color: #fffaf3;
          border: 1px solid var(--hs-border-subtle);
          color: var(--hs-text-primary);
          box-shadow: none;
        }
      }
    }

    .robot {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 260px;
      height: 260px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.8);
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.98) 0%,
        rgba(255, 245, 228, 0.9) 100%
      );
      box-shadow: var(--hs-shadow-soft);
    }
  }
}
</style>
