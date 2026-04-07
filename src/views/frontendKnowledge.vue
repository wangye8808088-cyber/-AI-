<template>
  <div class="knowledge-container">
    <div class="header-section">
      <div class="header-content">
        <el-image :src="iconUrl" style="width: 60px; height: 60px"></el-image>
        <h1>知识库</h1>
      </div>
    </div>
    <div class="content">
      <!-- 左侧菜单 -->
      <div class="recommend-section">
        <div class="section-title">推荐阅读</div>
        <div class="recommend-list">
          <div
            v-for="item in recommendList"
            :key="item.id"
            class="recommend-item"
            @click="goToArticle(item.id)"
          >
            <h4>{{ item.title }}</h4>
            <p class="read-count">
              <el-icon><Histogram /></el-icon>
              阅读量 {{ item.readCount }}
            </p>
          </div>
        </div>
      </div>
      <!-- 右侧内容 -->
      <div class="article-list">
        <div
          v-for="item in articleList"
          :key="item.id"
          class="article-item"
          @click="goToArticle(item.id)"
        >
          <el-image
            style="width: 240px; height: 150px"
            :src="getImage(item.coverImage)"
          ></el-image>
          <div class="info">
            <div class="title">
              <h3>{{ item.title }}</h3>
              <el-tag Plain type="primary">{{ item.categoryName }}</el-tag>
            </div>
            <div :style="{ marginTop: '10px' }">
              <div class="flex-box">
                <el-icon><Avatar /></el-icon>
                <span>{{ item.authorName }}</span>
              </div>
              <div class="flex-box">
                <el-icon><List /></el-icon>
                <span>{{ dayjs(item.updateAt).format("YYYY-MM-DD") }}</span>
              </div>
            </div>
            <div :style="{ marginTop: '10px' }">
              <div class="flex-box">
                <el-icon><Platform /></el-icon>
                <span>观看人数{{ item.readCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        style="margin-top: 25px"
        :page-size="pagination.size"
        layout="prev, pager, next"
        :total="pagination.total"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script setup>
import iconUrl from "@/assets/images/book.png";
import { getKnowledgeList } from "@/api/frontend";
import { ref, onMounted, reactive } from "vue";
import { dayjs } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

// 获取阅读列表
const recommendList = ref([]);

// 右侧列表数据
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});

const articleList = ref([]);

// 获取列表数据
const getPageList = () => {
  const params = {
    sortField: "publishedAt",
    sortDirection: "desc",
    ...pagination,
  };
  getKnowledgeList(params).then((res) => {
    articleList.value = res.records;
    pagination.total = res.total;
  });
};

// 获取封面图片
const getImage = (url) => {
  return url
    ? "http://159.75.169.224:1235" + url
    : "https://file.itndedu.com/psychology_ai.png";
};

// 分页
const handleChange = (page) => {
  pagination.currentPage = page;
  getPageList();
};

// 跳转到详情
const goToArticle = (id) => {
  router.push(`/knowledge/article/${id}`);
};

onMounted(() => {
  // 获取推荐阅读列表
  const params = {
    sortField: "readCount",
    sortDirection: "desc",
    currentPage: 1,
    size: 5,
  };
  getPageList();
  getKnowledgeList(params).then((res) => {
    recommendList.value = res.records;
  });
});
</script>

<style lang="scss" scoped>
.knowledge-container {
  min-height: 100%;
  background:
    radial-gradient(circle at 14% 18%, rgba(255, 214, 77, 0.3), transparent 45%),
    radial-gradient(circle at 86% 82%, rgba(255, 199, 222, 0.4), transparent 40%),
    var(--hs-bg);

  .flex-box {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }

  .header-section {
    background: linear-gradient(
      135deg,
      var(--hs-accent-yellow) 0%,
      #ffe5a6 40%,
      #ffd6c0 100%
    );
    color: var(--hs-text-primary);
    padding: 40px 56px;

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;

      h1 {
        font-size: 32px;
        font-weight: 800;
        letter-spacing: 0.3px;
      }
    }
  }

  .content {
    display: flex;
    gap: 24px;
    margin: 0 auto;
    max-width: 1200px;
    padding: 32px 20px 40px;

    .recommend-section {
      width: 280px;
      background: var(--hs-card);
      border-radius: var(--hs-radius-xl);
      box-shadow: var(--hs-shadow-soft);
      padding: 18px 18px 20px;
      max-height: 420px;

      .section-title {
        font-size: 14px;
        font-weight: 700;
        color: var(--hs-text-primary);
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .recommend-list {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .recommend-item {
          border-left: 4px solid var(--hs-accent-orange);
          padding-left: 12px;
          cursor: pointer;
          padding-block: 6px;
          border-radius: 6px;
          transition:
            background-color 0.15s ease,
            transform 0.15s ease,
            box-shadow 0.15s ease;

          h4 {
            font-size: 14px;
            font-weight: 600;
            color: var(--hs-text-primary);
          }

          .read-count {
            margin-top: 15px;
            font-size: 12px;
            color: var(--hs-text-secondary);
            display: flex;
            align-items: center;
            gap: 10px;
          }

          &:hover {
            background-color: #fff5eb;
            transform: translateY(-2px);
            box-shadow: var(--hs-shadow-soft);
          }
        }
      }
    }

    .article-list {
      flex: 1;

      .article-item {
        background: var(--hs-card);
        border-radius: var(--hs-radius-xl);
        box-shadow: var(--hs-shadow-soft);
        padding: 18px;
        margin-bottom: 22px;
        display: flex;

        .info {
          margin-left: 20px;

          .title {
            display: flex;
            align-items: center;
            gap: 10px;

            h3 {
              font-size: 18px;
              font-weight: 700;
              color: var(--hs-text-primary);
            }

            :deep(.el-tag) {
              border-radius: 999px;
            }
          }

          :deep(.el-image) {
            border-radius: var(--hs-radius-lg);
          }
        }
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    padding-bottom: 32px;

    :deep(.el-pagination.is-background .el-pager li) {
      border-radius: var(--hs-radius-pill);
    }
  }
}
</style>
