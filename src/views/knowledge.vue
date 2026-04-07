<template>
  <div class="knowledge-page">
    <PageHead title="知识文章">
      <!-- #为v-slot的缩写 -->
      <template #buttons>
        <el-button type="primary" @click="handleEdit({})">新增</el-button>
      </template>
    </PageHead>
    <!-- 
    :formItem="formItem" (Props):
    通过属性绑定，将父组件定义的配置数组 formItem 传递给子组件。
    子组件会遍历这个数组，根据里面的规则生成对应的输入框、下拉框等。 
    -->
    <div class="search-card">
      <TableSearch :formItem="formItem" @search="handleSearch" />
    </div>

    <div class="table-card">
      <el-table :data="tableData" class="hs-table">
        <el-table-column width="300" label="文章标题" fixed="left">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon><timer /></el-icon>
            <span>{{ scope.row.title }}</span>
          </div>
        </template>
        </el-table-column>
        <el-table-column label="分类" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon><timer /></el-icon>
            <span>{{ categoryMap[scope.row.categoryId] }}</span>
          </div>
        </template>
        </el-table-column>
        <el-table-column prop="authorName" label="作者" width="150" />
        <el-table-column prop="readCount" label="阅读量" width="150" />
        <el-table-column prop="updatedAt" label="发布时间" width="150" />
        <el-table-column label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-button @click="handleEdit(scope.row)" text type="primary"
            >编辑</el-button
          >
          <el-button
            @click="handleRublish(scope.row)"
            v-if="scope.row.status === 0 || scope.row.status === 2"
            text
            type="success"
            >发布</el-button
          >
          <el-button
            @click="handleUnpublish(scope.row)"
            v-if="scope.row.status === 1"
            text
            type="warning"
            >下线</el-button
          >
          <el-button @click="handleDelete(scope.row)" text type="danger">删除</el-button>
        </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-row">
      <el-pagination
        :page-size="pagination.size"
        layout="prev, pager, next"
        :total="pagination.total"
        @change="handleChange"
      />
    </div>

    <ArticleDialog
      v-model:modelValue="dialogVisible"
      :article="currentArticle"
      :categories="categories"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import PageHead from "@/components/PageHead.vue";
import TableSearch from "@/components/TableSearch.vue";
import {
  categoryTree,
  articlePage,
  getArticleDetail,
  changeArticleStatus,
  deleteArticle,
} from "@/api/admin";
import ArticleDialog from "@/components/ArticleDialog.vue";
import { ElMessageBox, ElMessage } from "element-plus";

const formItem = [
  {
    comp: "input",
    prop: "title",
    label: "文章标题",
    placeholder: "请输入文章标题",
  },
  {
    comp: "select",
    prop: "categoryId",
    label: "分类",
    placeholder: "请选择类型",
    options: [],
  },
  {
    comp: "select",
    prop: "status",
    label: "状态",
    placeholder: "请输入文章内容",
    options: [
      {
        label: "草稿",
        value: "0",
      },
      {
        label: "已发布",
        value: "1",
      },
      {
        label: "已下线",
        value: "2",
      },
    ],
  },
];

// 分页参数
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});

const handleSearch = async (formData) => {
  const params = {
    ...pagination,
    ...formData,
  };

  const { records, total } = await articlePage(params);
  tableData.value = records;
  pagination.total = total;
};

const handleChange = (page) => {
  pagination.currentPage = page;
  handleSearch();
};

// 分类映射
const categoryMap = reactive({});
// 分类列表
const categories = ref([]);

// 列表数据
const tableData = ref([]);

// 新增和编辑
const dialogVisible = ref(false);
const currentArticle = ref(null);
const handleSuccess = () => {
  // 关闭弹窗
  dialogVisible.value = false;
  // 刷新列表
  handleSearch();
};
const handleEdit = (row) => {
  if (!row.id) {
    // 新增
    currentArticle.value = null;
    dialogVisible.value = true;
  } else {
    // 编辑
    getArticleDetail(row.id).then((res) => {
      console.log(res, "编辑详细");
      currentArticle.value = res;
      dialogVisible.value = true;
    });
  }
};

// 发布
const handleRublish = (row) => {
  ElMessageBox.confirm(`确认发布文章${row.title}吗？`, "确认", {
    confirmButtonText: "确定发布",
    cancelButtonText: "取消",
    type: "info",
  }).then(() => {
    changeArticleStatus(row.id, { status: 1 }).then((res) => {
      ElMessage.success("发布成功");
      handleSearch();
    });
  });
};

// 下线
const handleUnpublish = (row) => {
  ElMessageBox.confirm(`确认下线文章${row.title}吗？`, "确认", {
    confirmButtonText: "确定下线",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    changeArticleStatus(row.id, { status: 2 }).then((res) => {
      ElMessage.success("下线成功");
      handleSearch();
    });
  });
};

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除文章${row.title}吗？`,
    '确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'danger',
    }
  ).then(() => {
    deleteArticle(row.id).then((res) => {
      ElMessage.success('删除成功')
      handleSearch();
    });
  })
};

onMounted(async () => {
  const data = await categoryTree();
  categories.value = data.map((item) => {
    categoryMap[item.id] = item.categoryName;
    return {
      label: item.categoryName,
      value: item.id,
    };
  });
  formItem[1].options = categories.value;

  // 获取列表
  handleSearch();
});
</script>

<style scoped lang="scss">
.knowledge-page {
  background: var(--hs-bg);
  min-height: 100%;
  padding: var(--hs-space-10);

  .search-card,
  .table-card {
    background: var(--hs-card);
    border-radius: var(--hs-radius-xl);
    box-shadow: var(--hs-shadow-soft);
  }

  .search-card {
    padding: var(--hs-space-6);
    margin-top: var(--hs-space-6);
  }

  .table-card {
    margin-top: var(--hs-space-6);
    padding: var(--hs-space-4);
    overflow: hidden; // enables rounded corners for el-table
  }

  .pagination-row {
    margin-top: var(--hs-space-6);
    display: flex;
    justify-content: flex-end;
  }

  // --- UI统一：按钮、输入、表格、弹窗 ---
  :deep(.el-button) {
    border-radius: var(--hs-radius-pill);
  }

  :deep(.el-button--text) {
    box-shadow: none !important;
  }

  :deep(.el-button--primary:not(.el-button--text)) {
    box-shadow: var(--hs-shadow-soft);
  }

  :deep(.el-input__wrapper),
  :deep(.el-select .el-input__wrapper) {
    border-radius: var(--hs-radius-md);
    box-shadow: 0 0 0 1px rgba(45, 42, 38, 0.08) inset;
    background-color: #fffdf9;
  }

  :deep(.el-table) {
    background: transparent;
  }

  :deep(.el-table__header-wrapper) {
    border-top-left-radius: var(--hs-radius-xl);
    border-top-right-radius: var(--hs-radius-xl);
    overflow: hidden;
  }

  :deep(.el-table__body-wrapper) {
    border-bottom-left-radius: var(--hs-radius-xl);
    border-bottom-right-radius: var(--hs-radius-xl);
  }

  :deep(.el-table__cell) {
    border-bottom: 1px solid rgba(45, 42, 38, 0.06);
  }

  :deep(.el-pagination.is-background .el-pager li) {
    border-radius: var(--hs-radius-pill);
  }

  :deep(.el-dialog__header),
  :deep(.el-dialog__footer) {
    border-bottom-left-radius: var(--hs-radius-xl);
    border-bottom-right-radius: var(--hs-radius-xl);
  }

  :deep(.el-dialog) {
    border-radius: var(--hs-radius-xl) !important;
    overflow: hidden;
  }
}
</style>
