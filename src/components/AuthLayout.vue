<template>
  <div class="auth-layout">
    <div class="left-section">
      <div class="content">
        <h2 class="title">心理 AI 助手</h2>
        <p class="text">温和陪伴每一个需要被理解的时刻</p>
        <div class="chips">
          <span>AI 陪伴</span>
          <span>呼吸练习</span>
          <span>情绪记录</span>
        </div>
        <div class="robot">
          <el-image
            style="width: 90px; height: 90px"
            :src="iconUrl"
            alt="心理AI助手"
          />
        </div>
      </div>
    </div>
    <div class="right-section">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
/*
- 作用 ：创建一个新的 URL 对象
- 参数 ：
- 第一个参数：相对路径 @/assets/images/robot-fill.png
- 第二个参数：基础 URL import.meta.url
- 返回值 ：一个 URL 对象，包含完整的资源路径
*/
const iconUrl = new URL("@/assets/images/机器人.png", import.meta.url).href;
</script>

<style scoped lang="scss">
.auth-layout {
  display: flex;
  min-height: 100vh;
  padding: var(--hs-space-8);
  gap: var(--hs-space-8);
  background:
    radial-gradient(
      circle at 15% 20%,
      rgba(255, 214, 77, 0.24),
      transparent 34%
    ),
    radial-gradient(
      circle at 85% 75%,
      rgba(255, 199, 222, 0.32),
      transparent 38%
    ),
    var(--hs-bg);

  .left-section {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    background: linear-gradient(
      130deg,
      var(--hs-accent-yellow) 0%,
      #ffe58a 45%,
      #fff1c9 100%
    );
    border-radius: var(--hs-radius-xl);
    box-shadow: var(--hs-shadow-card);
    min-height: calc(100vh - var(--hs-space-8) * 2);

    .content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: var(--hs-space-4);
      padding: var(--hs-space-10);
      text-align: center;

      .title {
        font-size: 40px;
        font-weight: 800;
        letter-spacing: 0.3px;
        color: var(--hs-text-primary);
      }

      .text {
        max-width: 460px;
        font-size: 19px;
        line-height: 1.65;
        color: var(--hs-text-secondary);
      }

      .chips {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--hs-space-3);
        margin-bottom: var(--hs-space-2);

        span {
          padding: 8px 16px;
          border-radius: var(--hs-radius-pill);
          background-color: rgba(255, 255, 255, 0.75);
          color: var(--hs-text-primary);
          font-size: 14px;
          box-shadow: var(--hs-shadow-soft);
        }
      }

      .robot {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 160px;
        height: 160px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.55);
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.9) 0%,
          rgba(255, 255, 255, 0.65) 100%
        );
        box-shadow: var(--hs-shadow-soft);
      }
    }
  }

  .right-section {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    min-height: calc(100vh - var(--hs-space-8) * 2);
    border-radius: var(--hs-radius-xl);
    background-color: var(--hs-surface);
    box-shadow: var(--hs-shadow-card);
    padding: clamp(24px, 5vw, 56px);
  }
}

@media (max-width: 980px) {
  .auth-layout {
    flex-direction: column;
  }
}
</style>
