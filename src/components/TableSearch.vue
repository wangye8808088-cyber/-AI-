<template>
  <el-form ref="ruleFormRef" :model="formData">
    <el-row :gutter="24">
      <template v-for="item in formItemAttrs" :key="item.prop">
        <el-col v-bind="item.col">
          <el-form-item :label="item.label" :prop="item.prop">
            <!-- :is 属性：这是它的核心。你传给 :is 什么组件名，它就在页面上渲染成什么组件。
                如果 :is="'el-input'"，它就变成一个输入框。
                如果 :is="'el-select'"，它就变成一个下拉框。 -->
            <!-- - 当用户在输入框中输入内容时， v-model 会触发 formData[item.prop] = 值 的操作
              - 由于 formData 是响应式的 Proxy 对象，这个赋值操作会：
              - 检查 item.prop 对应的属性是否存在
              - 如果不存在，自动添加该属性
              - 设置属性值并触发响应式更新
              - 通知相关组件重新渲染 -->
            <component
              v-model="formData[item.prop]"
              :is="isComp(item.comp)"
              :placeholder="item.placeholder"
            >
              <template v-if="item.comp === 'select'">
                <el-option label="全部" value="" />
                <el-option
                  v-for="opt in item.options"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </template>
            </component>
          </el-form-item>
        </el-col>
      </template>
    </el-row>

    <el-row>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset(ruleFormRef)">重置</el-button>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

const props = defineProps({
  formItem: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["search"]);

/* 
- 为 formItem 数组中的每个表单项添加响应式布局配置
- 配置了不同屏幕尺寸下的列宽：
- xs （超小屏幕）：24列（占满整行）
- sm （小屏幕）：12列（占半行）
- md （中等屏幕）：8列（占1/3行）
- lg （大屏幕）：6列（占1/4行）
- xl （超大屏幕）：6列（占1/4行）
*/
const formItemAttrs = computed(() => {
  const { formItem } = props;
  formItem.forEach((item) => {
    item.col = { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 };
  });

  return formItem;
});

// 表单数据
const ruleFormRef = ref();
const formData = reactive({});
const isComp = (comp) => {
  return {
    input: "el-input",
    select: "el-select",
  }[comp]; // [comp]: 这不是数组，而是对象属性访问器。它会去对象里查找变量 comp 对应的值。
};

const handleSearch = () => {
  emit("search", formData);
};

const handleReset = (formEl) => {
  // 先重置表单，然后再触发查询
  if(!formEl) return
  /*
  - resetFields() 是 Element Plus 表单组件的内置方法
  - 作用：将表单字段重置为初始值，并清除验证状态
  - 初始值：表单首次渲染时的字段值，或者通过 formData 初始化时的值
  */
  formEl.resetFields();
  // 重置完成后，触发查询事件，更新表格数据
  emit("search", formData);
};
</script>
