<template>
  <div class="page-head">
    <p class="page-title">{{props.title}}</p>
    <div class="action-btn">
      <!-- 具名插槽 -->
      <slot name="buttons"></slot>
    </div>  
  </div>
</template>

<script setup>

const props = defineProps({
  title: {
    type: String,
    default: "页面标题",
  },
})

</script>

<style scoped lang="scss">
.page-head {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .page-title {
    font-size: 24px;
    color: #2d3748;
  }
}
</style>