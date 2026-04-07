<template>
  <div class="emotionDiary-container">
    <div class="header-section">
      <div class="header-content">
        <el-image :src="iconUrl" style="width: 60px; height: 60px"></el-image>
        <h1>情绪日志</h1>
      </div>
    </div>
    <div class="content">
      <!-- 情绪评分 -->
      <div class="diary-card">
        <div class="title">今日情绪评分</div>
        <div class="section">
          <p>您今天的整体情绪状态如何？(1-10分)</p>
          <div class="rate">
            <el-rate
              v-model="diaryForm.moodScore"
              :texts="emotionStatus"
              show-texts
              :max="10"
              size="large"
            ></el-rate>
          </div>
        </div>
      </div>
      <!-- 主要情绪 -->
      <div class="diary-card">
        <div class="title">主要情绪</div>
        <div class="emotion-grid">
          <div
            v-for="emotion in emotionDptions"
            :key="emotion.name"
            :class="{ selected: emotion.name === diaryForm.dominantEmotion }"
            class="emotion-card"
            @click="selectEmotion(emotion.name)"
          >
            <el-image
              :src="emotion.url"
              style="width: 50px; height: 50px"
            ></el-image>
            <div class="emotion-name">{{ emotion.name }}</div>
          </div>
        </div>
      </div>
      <!-- 详细记录 -->
      <div class="diary-card">
        <div class="title">详细记录</div>
        <div class="detail-form">
          <div class="form-group">
            <div class="form-label">情绪触发因素</div>
            <el-input
              v-model="diaryForm.emotionTriggers"
              placeholder="今天什么事情影响了你的情绪？"
              type="textarea"
              :rows="3"
              maxLength="1000"
              show-word-limit
            ></el-input>
          </div>
          <div class="form-group">
            <div class="form-label">今日感想</div>
            <el-input
              v-model="diaryForm.diaryContent"
              placeholder="写下您今天的想法，感受或发生的有趣事情..."
              type="textarea"
              :rows="5"
              maxLength="2000"
              show-word-limit
            ></el-input>
          </div>
          <!-- 生活指标 -->
          <div class="life-indicators">
            <div class="indicator-group">
              <div class="form-label">睡眠质量</div>
              <el-select v-model="diaryForm.sleepQuality" placeholder="请选择">
                <el-option label="很差" :value="1"></el-option>
                <el-option label="较差" :value="2"></el-option>
                <el-option label="一般" :value="3"></el-option>
                <el-option label="良好" :value="4"></el-option>
                <el-option label="优秀" :value="5"></el-option>
              </el-select>
            </div>
            <div class="indicator-group">
              <div class="form-label">压力水品</div>
              <el-select v-model="diaryForm.stressLevel" placeholder="请选择">
                <el-option label="很低" :value="1"></el-option>
                <el-option label="较低" :value="2"></el-option>
                <el-option label="中等" :value="3"></el-option>
                <el-option label="较高" :value="4"></el-option>
                <el-option label="很高" :value="5"></el-option>
              </el-select>
            </div>
          </div>
          <div class="action-buttons">
            <el-button @click="resetForm">重置</el-button>
            <el-button type="primary" @click="submit">提交</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { dayjs } from "element-plus";
import { ElMessage } from "element-plus";
import { ref, reactive } from "vue";
import { addEmotionDiary } from "@/api/frontend";

// 情绪评分
const emotionStatus = [
  "绝望崩溃",
  "消沉抑郁",
  "焦虑烦躁",
  "低落不悦",
  "平静淡然",
  "轻松惬意",
  "愉悦舒心",
  "欢欣满足",
  "兴奋欣喜",
  "极致幸福",
];

// 情绪选项
const emotionDptions = [
  {
    name: "开心",
    url: new URL("@/assets/images/开心.png", import.meta.url).href,
  },
  {
    name: "平静",
    url: new URL("@/assets/images/平静.png", import.meta.url).href,
  },
  {
    name: "焦虑",
    url: new URL("@/assets/images/焦虑.png", import.meta.url).href,
  },
  {
    name: "悲伤",
    url: new URL("@/assets/images/悲伤.png", import.meta.url).href,
  },
  {
    name: "兴奋",
    url: new URL("@/assets/images/兴奋.png", import.meta.url).href,
  },
  {
    name: "疲惫",
    url: new URL("@/assets/images/疲惫.png", import.meta.url).href,
  },
  {
    name: "惊讶",
    url: new URL("@/assets/images/惊讶.png", import.meta.url).href,
  },
  {
    name: "困惑",
    url: new URL("@/assets/images/困惑.png", import.meta.url).href,
  },
];

// 选择主要情绪
const selectEmotion = (emotion) => {
  diaryForm.dominantEmotion = emotion;
};

const diaryForm = reactive({
  diaryDate: dayjs().format("YYYY-MM-DD"),
  moodScore: null,
  dominantEmotion: "",
  emotionTriggers: "",
  diaryContent: "",
  sleepQuality: null,
  stressLevel: null,
});

// 重置表单
const resetForm = () => {
  Object.assign(diaryForm, {
    diaryDate: dayjs().format("YYYY-MM-DD"),
    moodScore: null,
    dominantEmotion: "",
    emotionTriggers: "",
    diaryContent: "",
    sleepQuality: null,
    stressLevel: null,
  });
};

// 提交表单
const submit = () => {
  console.log(diaryForm);
  if (!diaryForm.moodScore) {
    ElMessage.error("请选择情绪评分");
    return;
  }
  addEmotionDiary(diaryForm).then(() => {
    ElMessage.success("提交成功");
    resetForm();
  });
};

const iconUrl = new URL("@/assets/images/like.png", import.meta.url).href;
</script>

<style lang="scss" scoped>
.emotionDiary-container {
  min-height: 100%;
  background:
    radial-gradient(circle at 12% 18%, rgba(255, 214, 77, 0.3), transparent 45%),
    radial-gradient(circle at 88% 82%, rgba(255, 199, 222, 0.4), transparent 40%),
    var(--hs-bg);

  .header-section {
    background: linear-gradient(
      135deg,
      var(--hs-accent-yellow) 0%,
      #ffe7b0 40%,
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
    margin: 0 auto;
    max-width: 980px;
    padding: 32px 20px 40px;

    .diary-card {
      margin-bottom: 24px;
      background: var(--hs-card);
      border-radius: var(--hs-radius-xl);
      padding: 24px 26px;
      box-shadow: var(--hs-shadow-soft);

      .title {
        margin-bottom: 18px;
        font-size: 22px;
        font-weight: 700;
        color: var(--hs-text-primary);
      }

      .section {
        margin-bottom: 20px;

        p {
          font-size: 15px;
          color: var(--hs-text-secondary);
          margin-bottom: 15px;
        }
      }

      .emotion-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;

        .emotion-card {
          padding: 16px 18px 14px;
          border: 1px solid var(--hs-border-subtle);
          border-radius: 999px;
          text-align: center;
          cursor: pointer;
          background: #fffaf3;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: var(--hs-shadow-soft);
          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease,
            border-color 0.15s ease,
            background-color 0.15s ease;

          .emotion-name {
            margin-top: 0;
            padding: 0 4px;
            color: var(--hs-text-primary);
            font-weight: 600;
          }

          &.selected {
            border-color: var(--hs-primary);
            background: #e3ebff;
            transform: translateY(-2px);
            box-shadow: 0 12px 26px rgba(47, 107, 255, 0.18);
          }
        }
      }

      .detail-form {
        .form-label {
          margin: 10px 0;
          color: var(--hs-text-primary);
          font-weight: 600;
        }

        .life-indicators {
          display: flex;
          gap: 20px;

          .indicator-group {
            flex: 1;
          }
        }

        .action-buttons {
          margin-top: 40px;
          display: flex;
          gap: 14px;
          justify-content: flex-end;
        }
      }
    }
  }

  // 统一输入、选择、按钮的圆角和柔和样式
  :deep(.el-input__wrapper),
  :deep(.el-textarea__inner),
  :deep(.el-select .el-input__wrapper) {
    border-radius: var(--hs-radius-md);
    box-shadow: 0 0 0 1px rgba(45, 42, 38, 0.08) inset;
    background-color: #fffdf9;
  }

  :deep(.el-rate__item .el-rate__icon) {
    margin-inline-end: 4px;
  }

  :deep(.el-button) {
    border-radius: var(--hs-radius-pill);
    min-width: 96px;
    height: 42px;
    font-weight: 600;
  }

  :deep(.el-button--primary) {
    box-shadow: var(--hs-shadow-soft);
  }
}
</style>
