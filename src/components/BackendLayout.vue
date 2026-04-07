<template>
  <div class="backend-layout">
    <el-container class="main-container">
      <Sidebar />
      <el-container>
        <el-header>
          <Navbar />
        </el-header>
        <el-main class="main-content">
          <router-view class="content-container" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Sidebar from "./Sidebar.vue";
import Navbar from "./Navbar.vue";
</script>

<!-- 此处需要安装sass依赖 -->
<style scoped lang="scss">
.backend-layout {
  height: 100vh;
  .el-header {
    // !important：强制设置高度，忽略其他样式。
    // 这是因为 El-Header 组件的默认高度是 60px，而我们希望它等于 74px。
    // 所以，我们需要使用 !important 来提高优先级
    height: 74px !important;
  }
  .main-container {
    height: 100%;
    .content-container {
      padding: 20px;
      background-color: #fff;
      // 利用了 CSS 的计算函数 calc()。
      // 100%：代表父容器（通常是整个浏览器窗口或布局外壳）的总高度。
      // - 74px：减去 74 像素。
      // 为什么要减去 74px？
      // 在后台管理系统中，顶部通常有一个导航栏（Header）。如果这个 Header 的高度正好是 74px，那么内容区域的高度就应该是：总高度 - 顶部导航栏高度。
      // min-height: 最小高度，内容超出时自动扩展
      // height: 固定高度，内容超出时会被截断
      min-height: calc(100% - 74px);
    }
  }
}
</style>
