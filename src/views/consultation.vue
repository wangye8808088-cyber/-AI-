<template>
  <div class="consultation-container">
    <div class="sidebar">
      <!-- AI助手信息 -->
      <div class="ai-assistant-info">
        <div class="breathing-circle">
          <el-image
            :src="iconUrl"
            style="width: 25px; height: 25px"
            alt="AI助手"
          />
        </div>
        <h3 class="assistant-name">宁渡AI助手</h3>
        <div class="online-status">
          <div class="status-dot"></div>
          在线服务中
        </div>
      </div>
      <!-- 情绪花园 -->
      <div class="emotion-garden">
        <div class="garden-header">
          <div class="garden-title">情绪花园</div>
        </div>
        <div class="emotion-info">
          <div class="emotion-name">中性</div>
          <div class="emotion-score">50</div>
        </div>
        <div class="warm-tips">
          <div class="emotion-status-text">
            <span class="status-label">今天感觉</span>
            <span class="status-emotion">{{
              currentEmotion.isNegative ? "需要关注" : "很不错"
            }}</span>
          </div>
          <div class="emotion-intensity">
            <span class="intensity-dots">
              <span
                v-for="dot in 3"
                :key="dot"
                class="dot"
                :class="{
                  active: getIntensityClass(currentEmotion.emotionScore) >= dot,
                }"
              ></span>
            </span>
            <span class="intensity-text">
              {{ getRiskTest(currentEmotion.riskLevel) }}
            </span>
          </div>
          <!-- 温暖建议卡片 -->
          <div class="warm-suggestion" v-if="currentEmotion.suggestion">
            <div class="suggestion-icon">💝</div>
            <div class="suggestion-content">
              <div class="suggestion-title">给你的小建议</div>
              <div class="suggestion-text">{{ currentEmotion.suggestion }}</div>
            </div>
          </div>
          <!-- 治愈行动 -->
          <div
            class="healing-actions"
            v-if="currentEmotion.improvementSuggestions.length > 0"
          >
            <div class="actions-title">治愈小行动</div>
            <div class="actions-list">
              <div
                v-for="action in currentEmotion.improvementSuggestions"
                :key="action"
                class="action-item"
              >
                <div class="action-icon">✨</div>
                <div class="action-text">{{ action }}</div>
              </div>
            </div>
          </div>
          <!-- 风险提示 -->
          <div
            class="risk-notice"
            v-if="currentEmotion.isNegative && currentEmotion.riskLevel > 1"
          >
            <div class="notice-icon">🤗</div>
            <div class="notice-content">
              <div class="notice-title">温馨提示</div>
              <div class="notice-text">
                {{ currentEmotion.riskDescription }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 会话列表 -->
      <div class="session-history">
        <h4 class="section-title">会话列表</h4>
        <div class="session-list">
          <div
            v-for="session in sessionList"
            :key="session.id"
            @click="handleSessionClick(session)"
            class="session-item"
          >
            <div class="session-info">
              <div class="session-title">
                <span>{{ session.sessionTitle }}</span>
                <div class="session-meta">
                  <span class="session-time">{{ session.startedAt }}</span>
                </div>
                <div class="session-preview">
                  {{ session.lastMessageContent }}
                </div>
                <div class="session-stats">
                  <span>
                    <el-icon>
                      <ChatRound />
                    </el-icon>
                    {{ session.messageCount || 0 }}
                  </span>
                  <span>
                    <el-icon>
                      <Clock />
                    </el-icon>
                    {{ session.durationMinutes || 0 }} 分钟
                  </span>
                </div>
              </div>
              <div class="session-actions">
                <el-button
                  text
                  type="danger"
                  size="small"
                  @click="handleDeleteSession(session.id)"
                >
                  <el-icon>
                    <DeleteFilled />
                  </el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-main">
      <div class="chat-header">
        <div class="header-left">
          <div class="chat-avatar">
            <el-image :src="iconUrl1" style="width: 30px; height: 30px" />
          </div>
          <div class="chat-info">
            <h2>宁渡AI助手</h2>
            <p>您贴心的AI心理健康助手</p>
          </div>
        </div>
        <el-button circle @click="createNewFrontendSession" title="新建会话">
          <el-icon>
            <Plus />
          </el-icon>
        </el-button>
      </div>
      <!-- 聊天消息取区域 -->
      <div class="chat-messages">
        <!-- 欢迎用语 -->
        <div class="message-item ai-message" v-if="messages.length === 0">
          <div class="message-avatar">
            <el-image :src="iconUrl" style="width: 18px; height: 18px" />
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <p>
                你好！我是小暖，您的AI心理健康助手。很高兴陪伴您，为您提供温暖的心理支持。请告诉我，今天您感觉怎么样？有什么想要分享的吗？
              </p>
            </div>
            <div class="message-item">刚刚</div>
          </div>
        </div>
        <!-- 消息列表 -->
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="message-item"
          :class="msg.senderType === 1 ? 'user-message' : 'ai-message'"
        >
          <div class="message-avatar">
            <el-image
              v-if="msg.senderType === 1"
              :src="iconUrl2"
              style="width: 18px; height: 18px"
            />
            <el-image
              v-if="msg.senderType === 2"
              :src="iconUrl"
              style="width: 18px; height: 18px"
            />
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <!-- AI正在思考中 -->
              <div
                v-if="msg.senderType === 2 && isAiTying && !msg.content"
                class="typing-indicator"
              >
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
              </div>
              <!-- AI错误提示 -->
              <div v-else-if="msg.isError" class="error-message">
                <p>{{ msg.content }}</p>
              </div>
              <!-- AI正常返回消息 -->
              <MarkdownRenderer
                v-else-if="msg.senderType === 2 && !msg.isError"
                :content="msg.content"
                :isAiMessage="true"
              />
              <p
                v-else-if="msg.content"
                v-html="formatMessageCount(msg.content)"
              ></p>
            </div>
            <div class="message-time">
              {{
                msg.senderType === 2 && isAiTying
                  ? "正在输入中..."
                  : msg.createAt
              }}
            </div>
          </div>
        </div>
      </div>
      <!-- 消息输入区域 -->
      <div class="chat-input">
        <div class="input-container">
          <el-input
            v-model="userMessage"
            placeholder="请输入您想要分享的内容..."
            type="textarea"
            :rows="3"
            :disabled="isAiTying"
            @keydown.enter="handleKeyDown"
            class="message-input"
            clearable
          />
          <div class="input-footer">
            <span>按住Enter发送，Shift+Enter换行</span>
            <span>{{ userMessage.length }}/500</span>
          </div>
        </div>
        <el-button
          :disabled="!userMessage.trim() || userMessage.length > 500"
          type="primary"
          class="send-btn"
          @click="sendMessage"
        >
          <el-icon>
            <Promotion />
          </el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Clock, Promotion } from "@element-plus/icons-vue";
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import {
  startSession,
  getSessionList,
  deleteSession,
  getSessionDetail,
  getSessionEmotion,
} from "@/api/frontend";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const iconUrl = new URL("@/assets/images/robot-fill.png", import.meta.url).href;
const iconUrl1 = new URL("@/assets/images/like.png", import.meta.url).href;
const iconUrl2 = new URL("@/assets/images/users.png", import.meta.url).href;

// 新建会话
const createNewFrontendSession = () => {
  // 清空消息列表
  messages.value = [];
  // 重置情绪花园数据
  currentEmotion.value = {
    primaryEmotion: "中性",
    emotionScore: 50,
    isNegative: false,
    riskLevel: 0,
    suggestion: "情绪状态平稳",
    improvementSuggestions: [],
  };
  // 创建一个新的会话对象
  const newSession = {
    sessionId: `temp_${Date.now()}`,
    status: "TEMP",
    sessionTitle: "新对话",
  };
  currentSession.value = newSession;
};

// 定义一个当前会话对象
const currentSession = ref(null);
const sessionList = ref([]);

// 定义对话消息
const messages = ref([]);
// 定义用户输入的消息
const userMessage = ref("");
// 定义AI是否正在回复
const isAiTying = ref(false);

// 情绪花园
const currentEmotion = ref({
  primaryEmotion: "中性",
  emotionScore: 50,
  isNegative: false,
  riskLevel: 0,
  suggestion: "情绪状态平稳",
  improvementSuggestions: [],
});

const loadSessionEmotion = (sessionId) => {
  // 确保sessionID格式正确
  const id = sessionId.toString().startsWith("session_")
    ? sessionId
    : `session_${sessionId}`;

  getSessionEmotion(id).then((res) => {
    currentEmotion.value = res;
  });
};

const getIntensityClass = (score) => {
  if (score >= 61) {
    return 3;
  }
  if (score >= 31) {
    return 2;
  }
  return 1;
};

const getRiskTest = (level) => {
  switch (level) {
    case 0:
      return "正常";
    case 1:
      return "关注";
    case 2:
      return "预警";
    case 3:
      return "危机";
    default:
      return "正常";
  }
};

// 处理用户按下Enter键
const handleKeyDown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    // 发送消息逻辑
    e.preventDefault();
    sendMessage();
  }
};

// 用户发送消息
const sendMessage = () => {
  if (!userMessage.value.trim()) return;

  if (isAiTying.value) {
    ElMessage.error("AI助手正在回复中，请稍后");
    return;
  }

  const message = userMessage.value.trim();
  userMessage.value = "";

  // 如果没有会话或者是临时会话的化，需要创建一个新的会话
  if (currentSession.value.status === "TEMP") {
    startNewSession(message);
  } else {
    // 继续现有会话
    messages.value.push({
      id: Date.now(),
      senderType: 1,
      content: message,
      createAt: new Date().toISOString(),
    });
    startAIResopnse(currentSession.value.sessionId, message);
  }
};

const startNewSession = (message) => {
  // 创建新的绘画参数
  const sessionParams = {
    initialMessage: message,
  };
  if (currentSession.value.sessionTitle === "新对话") {
    sessionParams.sessionTitle = `宁渡AI助手 - ${new Date().toLocaleString()}`;
  } else {
    // 如果历史会话记录
    sessionParams.sessionTitle = currentSession.value.sessionTitle;
  }
  // 调用开始会话接口
  startSession(sessionParams).then((res) => {
    // 将后端返回的数据转为前端会话格式
    const sessionData = {
      sessionId: res.sessionId,
      status: res.status,
      sessionTitle: sessionParams.sessionTitle,
    };
    // 如果当前是临时会话，更细数据
    if (currentSession.value && currentSession.value.status === "TEMP") {
      // 更新为正式会话
      Object.assign(currentSession.value, sessionData);
    } else {
      // 否则，创建一个新的会话
      currentSession.value = sessionData;
    }
    // 更新会话列表
    getSessionPage();

    // 添加初始用户信息
    messages.value.push({
      id: Date.now(),
      senderType: 1,
      content: message,
      createAt: new Date().toISOString(),
    });

    // 流式对话
    startAIResopnse(currentSession.value.sessionId, message);
  });
};

const startAIResopnse = (sessionId, userMessage) => {
  // 防止重复发送
  if (isAiTying.value) {
    ElMessage.error("AI助手正在回复中，请稍后");
    return;
  }
  isAiTying.value = true;

  const aiMessage = {
    id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    senderType: 2,
    content: "",
    createAt: new Date().toISOString(),
  };
  messages.value.push(aiMessage);

  // 调用流式接口
  const ctrl = new AbortController(); // 用来终止fetch请求
  fetchEventSource("/api/psychological-chat/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Token: localStorage.getItem("token"),
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      sessionId,
      userMessage,
    }),
    signal: ctrl.signal, // 用来终止fetch请求
    onopen: (response) => {
      console.log(response);
      if (response.headers.get("Content-Type") !== "text/event-stream") {
        ElMessage.error("AI助手回复失败，请稍后重试");
      }
    },
    onmessage: (event) => {
      const raw = event.data.trim();
      if (!raw) return;
      const eventName = event.event;
      // 当前会话AI消息
      const aiMessage = messages.value[messages.value.length - 1];

      if (eventName === "done") {
        isAiTying.value = false;
        ctrl.abort(); // 终止fetch请求
        // 加载会话情绪分析
        loadSessionEmotion(currentSession.value.sessionId);
        return;
      }
      const payload = JSON.parse(raw);
      const ok = String(payload.code) === "200";
      if (ok && payload.data && payload.data.content) {
        aiMessage.content += payload.data.content;
      } else if (!ok) {
        // 错误回复显示
        handleError(payload.message || "AI助手回复失败，请稍后重试");
      }
    },
    onerror: (err) => {
      handleError(err || "AI助手回复失败，请稍后重试");
      throw err;
    },
    onclose: () => {
      // 开始情绪分析
      loadSessionEmotion(currentSession.value.sessionId);
    },
  });
};

// 错误处理函数
const handleError = (error) => {
  // 当前会话的AI消息
  const aiMessage = messages.value[messages.value.length - 1];
  if (aiMessage) {
    aiMessage.content = "AI回复失败，请重试";
  }
  isAiTying.value = false;
  ElMessage.error("AI回复失败，请重试");
};

const getSessionPage = () => {
  getSessionList({ pageNum: 1, pageSize: 10 }).then((res) => {
    sessionList.value = res.records;
  });
};
// 获取会话数据
const handleSessionClick = (session) => {
  currentSession.value = session;
  // 获取会话详情
  getSessionDetail(session.id).then((res) => {
    messages.value = res;
  });
  // 加载会话情绪分析
  loadSessionEmotion(session.id);
  // 更新当前会话对象的数据
  const sessionData = {
    sessionId: "session_" + session.id,
    status: "ACTIVE",
    sessionTitle: session.sessionTitle,
  };
  currentSession.value = sessionData;
};

const handleDeleteSession = (sessionId) => {
  deleteSession(sessionId).then((res) => {
    ElMessage.success("会话删除成功");
    getSessionPage();
  });
};

// 处理简单的换行逻辑
const formatMessageCount = (message) => {
  return message.replace(/\n/g, "<br>");
};

onMounted(() => {
  // 初始化时获取会话列表
  getSessionPage();
  // 初始化时创建一个新的会话
  createNewFrontendSession();
});
</script>

<style scoped lang="scss">
.consultation-container {
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
  display: flex;
  gap: var(--hs-space-6);
  padding: var(--hs-space-10) var(--hs-space-6);
  background:
    radial-gradient(circle at 12% 18%, rgba(255, 214, 77, 0.25), transparent 45%),
    radial-gradient(circle at 88% 82%, rgba(255, 199, 222, 0.3), transparent 42%),
    transparent;
  .sidebar {
    width: 320px;
    .ai-assistant-info {
      margin-bottom: var(--hs-space-6);
      background: var(--hs-card);
      border-radius: var(--hs-radius-xl);
      padding: var(--hs-space-6);
      box-shadow: var(--hs-shadow-soft);
      border: 1px solid var(--hs-border-subtle);
      transition: all 0.3s ease;
      .breathing-circle {
        width: 60px;
        height: 60px;
        background: linear-gradient(
          135deg,
          var(--hs-accent-orange) 0%,
          var(--hs-accent-yellow) 100%
        );
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 12px;
        animation: breathing 4s ease-in-out infinite;
        box-shadow: 0 10px 22px rgba(255, 138, 61, 0.18);
        position: relative;
      }
      .assistant-name {
        font-size: 16px;
        font-weight: 700;
        text-align: center;
        color: var(--hs-text-primary);
        margin: 0 0 12px;
      }
      .online-status {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--hs-text-secondary);
        font-size: 12px;
        font-weight: 600;
        .status-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          margin-right: 8px;
          animation: pulse 2s infinite;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.25);
        }
      }
    }
    .session-history {
      background: var(--hs-card);
      border-radius: var(--hs-radius-xl);
      padding: var(--hs-space-6);
      box-shadow: var(--hs-shadow-soft);
      border: 1px solid var(--hs-border-subtle);
      margin-bottom: var(--hs-space-6);
      min-height: 250px;
      display: flex;
      flex-direction: column;
      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--hs-text-primary);
        margin: 0 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .session-list {
        overflow-y: auto;
        max-height: 200px;
        scrollbar-width: thin;
        scrollbar-color: rgba(45, 42, 38, 0.18) transparent;
        .session-item {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          margin-bottom: 8px;
          border-radius: var(--hs-radius-lg);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid transparent;
          &:hover {
            background: #fffaf3;
            border-color: rgba(255, 138, 61, 0.18);
          }
          &.active {
            background: var(--hs-primary-soft);
            border-color: rgba(47, 107, 255, 0.28);
          }
          .session-info {
            flex: 1;
            .session-title {
              font-weight: 500;
              font-size: 14px;
              color: var(--hs-text-primary);
              margin-bottom: 4px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              .session-meta {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 6px;
                .session-time {
                  font-size: 12px;
                  color: var(--hs-text-secondary);
                }
              }
              .session-preview {
                width: 200px;
                font-size: 12px;
                color: var(--hs-text-secondary);
                margin-bottom: 6px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .session-stats {
                display: flex;
                align-items: center;
                gap: 12px;
                span {
                  font-size: 12px;
                  color: var(--hs-text-secondary);
                  display: flex;
                  align-items: center;
                  gap: 4px;
                }
              }
            }
            .session-actions {
              position: absolute;
              top: 10px;
              right: 12px;
            }
          }
        }
        .no-sessions-text {
          text-align: center;
          font-size: 14px;
          color: var(--hs-text-secondary);
        }
      }
    }
    .emotion-garden {
      background: var(--hs-surface);
      border-radius: var(--hs-radius-xl);
      padding: var(--hs-space-6);
      margin-bottom: var(--hs-space-6);
      box-shadow: var(--hs-shadow-soft);
      border: 1px solid var(--hs-border-subtle);
      position: relative;
      overflow: hidden;
      min-height: 300px;

      .garden-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        position: relative;
        z-index: 2;
        .garden-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: var(--hs-text-primary);
        }
      }
      .emotion-info {
        margin: 0 auto;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.8);
        background: linear-gradient(135deg, #ffe6f0 0%, #fff2d6 100%);
        color: var(--hs-text-primary);
        .emotion-name {
          font-size: 15px;
          font-weight: 600;
          line-height: 1;
          margin-bottom: 2px;
        }
        .emotion-score {
          font-size: 14px;
          font-weight: 700;
          opacity: 0.9;
        }
      }
      .warm-tips {
        text-align: center;
        margin-bottom: 16px;
        .emotion-status-text {
          margin-bottom: 12px;
          .status-label {
            font-size: 14px;
            color: var(--hs-text-secondary);
            margin-right: 8px;
          }
          .status-emotion {
            font-size: 16px;
            font-weight: 600;
            padding: 4px 12px;
            border-radius: var(--hs-radius-pill);
            display: inline-block;
            background: #fffaf3;
            border: 1px solid var(--hs-border-subtle);
          }
        }
        .emotion-intensity {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          .intensity-dots {
            display: flex;
            gap: 4px;
            .dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #e0e0e0;
              transition: all 0.3s ease;
              &.active {
                background: linear-gradient(
                  135deg,
                  var(--hs-accent-pink),
                  var(--hs-accent-yellow)
                );
                transform: scale(1.2);
                box-shadow: 0 2px 8px rgba(255, 154, 158, 0.4);
              }
            }
          }
          .intensity-text {
            font-size: 12px;
            color: var(--hs-text-secondary);
            font-weight: 500;
          }
        }
        .warm-suggestion {
          background: var(--hs-card);
          border-radius: var(--hs-radius-lg);
          padding: 12px;
          margin-bottom: 16px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          border: 1px solid var(--hs-border-subtle);
          box-shadow: var(--hs-shadow-soft);
          .suggestion-icon {
            font-size: 20px;
            flex-shrink: 0;
            margin-top: 2px;
          }
          .suggestion-content {
            text-align: left;
            flex: 1;
            .suggestion-title {
              font-size: 14px;
              font-weight: 600;
              color: var(--hs-text-primary);
              margin-bottom: 6px;
            }
            .suggestion-text {
              font-size: 13px;
              color: var(--hs-text-secondary);
              line-height: 1.5;
            }
          }
        }
        .healing-actions {
          margin-bottom: 16px;
          .actions-title {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 600;
            color: var(--hs-text-primary);
            margin-bottom: 16px;
          }
          .actions-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            .action-item {
              background: var(--hs-card);
              border-radius: var(--hs-radius-lg);
              padding: 12px;
              display: flex;
              align-items: center;
              gap: 10px;
              border: 1px solid var(--hs-border-subtle);
              box-shadow: var(--hs-shadow-soft);
              text-align: left;
              .action-icon {
                font-size: 14px;
                color: var(--hs-accent-orange);
                flex-shrink: 0;
              }
              .action-text {
                font-size: 12px;
                color: var(--hs-text-secondary);
                line-height: 1.4;
                flex: 1;
              }
            }
          }
        }
        .risk-notice {
          background: #fff5eb;
          border-radius: var(--hs-radius-lg);
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          border: 1px solid rgba(255, 138, 61, 0.2);
          box-shadow: var(--hs-shadow-soft);
          .notice-icon {
            font-size: 20px;
            flex-shrink: 0;
            margin-top: 2px;
          }
          .notice-content {
            flex: 1;
            .notice-title {
              font-size: 14px;
              font-weight: 600;
              color: var(--hs-text-primary);
              margin-bottom: 6px;
            }
            .notice-text {
              font-size: 13px;
              color: var(--hs-text-secondary);
              line-height: 1.5;
            }
          }
        }
      }
    }
  }
  .chat-main {
    background: var(--hs-card);
    border-radius: var(--hs-radius-xl);
    box-shadow: var(--hs-shadow-card);
    border: 1px solid var(--hs-border-subtle);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 1;
    .chat-header {
      background: linear-gradient(
        135deg,
        var(--hs-accent-yellow) 0%,
        #fff1c9 100%
      );
      color: var(--hs-text-primary);
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      flex-shrink: 0;
      .header-left {
        display: flex;
        align-items: center;
        .chat-avatar {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          box-shadow: var(--hs-shadow-soft);
          position: relative;
          z-index: 1;
        }
        .chat-info {
          h2 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 4px;
          }
          p {
            font-size: 14px;
            color: var(--hs-text-secondary);
          }
        }
      }
      :deep(.el-button) {
        border-radius: var(--hs-radius-pill);
        box-shadow: var(--hs-shadow-soft);
      }
    }
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: var(--hs-surface);
      min-height: 0;
      max-height: calc(100vh - 200px);
      scrollbar-width: thin;
      scrollbar-color: rgba(45, 42, 38, 0.18) transparent;
      .message-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: white;
          flex-shrink: 0;
        }
        &.ai-message {
          .message-avatar {
            background: var(--hs-accent-orange);
            box-shadow: 0 10px 20px rgba(255, 138, 61, 0.22);
          }
        }
        &.user-message {
          .message-avatar {
            background: var(--hs-primary);
            box-shadow: 0 10px 20px rgba(47, 107, 255, 0.22);
          }
        }
        .message-content {
          max-width: 70%;
          .message-bubble {
            background: var(--hs-card);
            border-radius: var(--hs-radius-lg);
            padding: 12px 16px;
            position: relative;
            animation: fadeInUp 0.4s ease-out;
            border: 1px solid var(--hs-border-subtle);
            box-shadow: var(--hs-shadow-soft);
            .typing-indicator {
              display: flex;
              gap: 4px;
              padding: 8px 0;
              .typing-dot {
                width: 8px;
                height: 8px;
                background: #ccc;
                border-radius: 50%;
                animation: typing 1.5s ease-in-out infinite;
                &:nth-child(2) {
                  animation-delay: 0.2s;
                }
                &:nth-child(3) {
                  animation-delay: 0.4s;
                }
              }
            }
            /* 错误消息样式 */
            .error-message {
              background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
              border: 1px solid #f87171;
              border-radius: 12px;
              padding: 12px 16px;
              color: #991b1b;
              font-weight: 500;
              display: flex;
              align-items: center;
              gap: 8px;
            }
          }
          .message-time {
            font-size: 12px;
            color: var(--hs-text-secondary);
            margin-top: 4px;
          }
        }
      }
    }
    .chat-input {
      border-top: 1px solid var(--hs-border-subtle);
      padding: 20px 24px;
      display: flex;
      gap: 12px;
      align-items: flex-end;
      background: var(--hs-card);
      flex-shrink: 0;
      .input-container {
        flex: 1;
      }
      .input-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: var(--hs-text-secondary);
        font-weight: 500;
      }
      .send-btn {
        height: 60px;
        width: 60px;
        border-radius: var(--hs-radius-md);
        background: var(--hs-primary) !important;
        border: none !important;
        box-shadow: 0 10px 22px rgba(47, 107, 255, 0.22);
        transition: all 0.3s ease;
      }
    }
  }

  :deep(.el-input__wrapper),
  :deep(.el-textarea__inner) {
    border-radius: var(--hs-radius-md);
    box-shadow: 0 0 0 1px rgba(45, 42, 38, 0.08) inset;
    background-color: #fffdf9;
  }
}

@media (max-width: 980px) {
  .consultation-container {
    flex-direction: column;
    padding: var(--hs-space-8) var(--hs-space-4);
    .sidebar {
      width: 100%;
    }
  }
}
</style>
