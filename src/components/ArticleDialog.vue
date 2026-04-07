<template>
  <!-- 弹窗组件 -->
  <el-dialog
    :title="isEdit ? '文章详情' : '新增文章'"
    v-model="dialogVisible"
    width="50%"
    @close="handleClose"
  >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="请输入文章标题"
          maxlength="200"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择分类">
          <el-option
            v-for="item in props.categories"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input
          type="textarea"
          v-model="formData.summary"
          placeholder="请输入文章摘要(可选)"
          maxlength="1000"
          show-word-limit
          :rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select
          v-model="formData.tagArray"
          placeholder="请输入标签(可选)"
          multiple
          filterable
          allow-create
          style="width: 100%"
        >
          <el-option
            v-for="tag in commonTags"
            :key="tag"
            :label="tag"
            :value="tag"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片">
        <div class="cover-upload">
          <el-upload
            class="avatar-uploader"
            action="#"
            :before-upload="beforeUpload"
            :http-request="handleUploadRequest"
            :show-file-list="false"
            accept="image/*"
          >
            <div v-if="!imgUrl" class="cover-placeholder">
              <p>点击上传封面</p>
            </div>
            <img v-else :src="imgUrl" class="cover-image" alt="封面图片" />
          </el-upload>
          <div v-if="imgUrl" class="covew-remove">
            <el-button type="danger" size="small" @click="handleRemove"
              >移除封面</el-button
            >
          </div>
        </div>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor
          v-model="formData.content"
          placeholder="请输入文章内容，支持富文本格式\n\n可以使用加粗、斜体、列表、标题等格式来丰富文章内容。"
          :maxCharCount="5000"
          @change="handleContentChange"
          @created="handleEditorCreated"
          min-height="400px"
        />
      </el-form-item>
    </el-form>
    <div v-if="btnPreview">
      <div v-html="formData.content"></div>
    </div>
    <template #footer>
      <el-button @click="btnPreview = !btnPreview">{{
        btnPreview ? "关闭预览" : "预览效果"
      }}</el-button>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">{{
        isEdit ? "更新文章" : "创建文章"
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, reactive, ref, nextTick, watch } from "vue";
import { ElMessage } from "element-plus";
import { uploadFile, creatArticle, updateArticle } from "@/api/admin";
import { fileBaseUrl } from "@/config/index";
import RichTextEditor from "@/components/RichTextEditor.vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    // default是默认值
    default: false,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  article: {
    type: Object,
    default: null,
  },
});

/*
- defineEmits 声明事件列表 ：

- 它的作用是 声明 组件可以触发的 所有事件类型
- 相当于定义了一个"事件清单"，告诉 Vue 和开发者这个组件会触发哪些事件
- 可以同时声明多个事件，例如： defineEmits(["update:modelValue", "save", "cancel"])
- emit 函数触发特定事件 ：

- 它是 defineEmits 返回的一个函数
- 调用时需要 指定要触发的具体事件名称 和传递的数据
- 只能触发在 defineEmits 中已声明的事件
 */

const emit = defineEmits(["update:modelValue", "success"]);

const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

// 监听编辑数据
watch(
  () => props.article,
  (newVal) => {
    if (newVal) {
      nextTick(() => {
        Object.assign(formData, newVal);
        // 使用现有得ID
        businessId.value = newVal.id;
        // 封面Url
        imgUrl.value = fileBaseUrl + newVal.coverImage;
      });
    }
  },
);

// !! 标识将后面得内容转换为布尔值
const isEdit = computed(() => !!props.article?.id);

const handleClose = () => {
  // 重置表单
  formRef.value.resetFields();
  // 重置ID
  businessId.value = null;
  // 重置标签
  formData.tagArray = [];
  // 重置封面图片和数据
  handleRemove();
  emit("update:modelValue", false);
};

// 表单数据
const formData = reactive({
  title: "",
  content: "",
  coverImage: "",
  categoryId: "",
  summary: "",
  tags: "",
  id: "",
});

// 表单校验
const rules = reactive({
  title: [
    { required: true, message: "请输入文章标题", trigger: "blur" },
    { max: 200, message: "文章标题最多200个字符", trigger: "blur" },
  ],
  categoryId: [{ required: true, message: "请选择分类", trigger: "change" }],
  content: [
    { required: true, message: "请输入文章内容", trigger: "blur" },
    { max: 5000, message: "文章内容最多5000个字符", trigger: "blur" },
  ],
});

const commonTags = [
  "情绪管理",
  "焦虑",
  "抑郁",
  "压力",
  "睡眠",
  "冥想",
  "正念",
  "放松",
  "心理健康",
  "自我成长",
  "人际关系",
  "工作压力",
  "学习方法",
  "生活技巧",
];

// 上传
const imgUrl = ref(""); // 当前上传的图片url
const beforeUpload = (file) => {
  // 针对上传的文件进行校验
  const isImage = file.type.startsWith("image/");
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isImage) {
    ElMessage.error("请上传图片文件");
    return false;
  }
  if (!isLt5M) {
    ElMessage.error("图片大小不能超过5MB");
    return false;
  }
  return true;
};

const businessId = ref(null);
const handleUploadRequest = async ({ file }) => {
  // UUID生成
  // crypto是专门进行加密的一个对象
  businessId.value = crypto.randomUUID();

  const fileRes = await uploadFile(file, {
    businessId: businessId.value,
  });

  // 拼接完整的图片地址
  // filePath是后端返回的图片地址
  imgUrl.value = fileBaseUrl + fileRes.filePath;
  formData.coverImage = imgUrl.value;
};

// 移除封面
const handleRemove = () => {
  // 清空图片url和封面图片
  imgUrl.value = "";
  formData.coverImage = "";
};

// 富文本
const handleContentChange = (data) => {
  formData.content = data.html;
};

const editorInstance = ref(null);

const handleEditorCreated = (editor) => {
  editorInstance.value = editor;
  // 编辑
  if (formData.content && editor) {
    // 等待编辑器创建完成后再设置内容
    // 因为编辑器需要等待 DOM 渲染完成才能正常工作
    // 所以这里使用 nextTick 确保 DOM 渲染完成后再设置内容
    nextTick(() => {
      editor.setHtml(formData.content);
    });
  }
};

const btnPreview = ref(false);

// 提交
const formRef = ref();
const loading = ref(false);
const handleSubmit = () => {
  formRef.value.validate((vaild, fields) => {
    if (vaild) {
      loading.value = true;
    }
    console.log(formData);

    const submitData = {
      ...formData,
      tags: formData.tagArray.join(","),
    };
    delete submitData.tagArray;

    if (!isEdit.value) {
      // 新增
      submitData.id = businessId.value
      creatArticle(submitData).then((res) => {
        loading.value = false;
        emit("success");
      });
    } else {
      // 编辑
      updateArticle(props.article.id, submitData).then((res) => {
        loading.value = false;
        emit("success");
      });
    }
  });
};
</script>

<style lang="scss" scoped>
.cover-placeholder {
  width: 200px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8b949e;
  background: #f6f8fa;
}
.cover-image {
  width: 200px;
  height: 120px;
  object-fit: block;
}
</style>
