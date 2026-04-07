<template>
  <div class="container">
    <div class="title">
      <div class="title-text">
        <h2>创建您的账户</h2>
        <p>请填写注册信息</p>
      </div>
    </div>
    <div class="form-container">
      <el-form
        label-position="top"
        :model="formData"
        :rules="rules"
        ref="submitFormRef"
      >
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名"
            size="large"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
            size="large"
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="formData.nickname"
            placeholder="请输入昵称(可选)"
            size="large"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="formData.phone"
            placeholder="请输入手机号（可选)"
            size="large"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入密码"
            size="large"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="formData.confirmPassword"
            placeholder="请再次输入密码"
            size="large"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            class="btn"
            type="primary"
            @click="submitForm(submitFormRef)"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { register } from "@/api/frontend";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

const formData = reactive({
  username: "",
  email: "",
  nickname: "",
  phone: "",
  password: "",
  confirmPassword: "",
  gender: 0, // 性别
  userType: 1, // 用户类型 1为普通用户
});

const rules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  confirmPassword: [{ required: true, message: "请确认密码", trigger: "blur" }],
});

// 表单提交
const submitFormRef = ref(null);
const submitForm = async (formEl) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    register(formData).then(({ data }) => {
      if (!data) {
        ElMessage.success("注册成功");
        // 注册成功后跳转到登录页   
        router.push("/auth/login");
      }
      if (data.code === "BUSINESS_ERROR") {
        ElMessage.error(data.message);
      }
    });
  });
};
</script>

<style scoped lang="scss">
.container {
  width: min(420px, 100%);
  background-color: var(--hs-card);
  border-radius: var(--hs-radius-lg);
  box-shadow: var(--hs-shadow-soft);
  padding: clamp(24px, 4vw, 40px);

  .flex-box {
    display: flex;
    align-items: center;
  }

  .title {
    padding-bottom: var(--hs-space-4);
    border-bottom: 1px solid var(--hs-border-subtle);
    margin-bottom: var(--hs-space-6);

    .title-text {
      text-align: center;

      h2 {
        font-size: clamp(30px, 4vw, 38px);
        margin-bottom: var(--hs-space-3);
        font-weight: 800;
        letter-spacing: 0.2px;
        color: var(--hs-text-primary);
        line-height: 1.2;
      }

      p {
        font-size: 17px;
        color: var(--hs-text-secondary);
        line-height: 1.6;
      }
    }
  }

  .form-container {
    margin-top: 0;

    :deep(.el-form-item) {
      margin-bottom: var(--hs-space-5);
    }

    :deep(.el-form-item__label) {
      color: var(--hs-text-primary);
      font-size: 15px;
      font-weight: 600;
      line-height: 1.4;
    }

    :deep(.el-input__wrapper) {
      border-radius: var(--hs-radius-md);
      box-shadow: 0 0 0 1px rgba(45, 42, 38, 0.08) inset;
      padding: 10px 14px;
      background-color: #fffdf9;
    }

    :deep(.el-input__inner) {
      color: var(--hs-text-primary);
      font-size: 15px;
    }

    .btn {
      margin-top: var(--hs-space-6);
      width: 100%;
      height: 48px;
      border: none;
      border-radius: var(--hs-radius-pill);
      background-color: var(--hs-primary);
      box-shadow: 0 10px 22px rgba(47, 107, 255, 0.28);
      font-weight: 700;
      letter-spacing: 0.2px;
    }

    :deep(.el-button--primary:focus-visible),
    .btn:focus-visible {
      outline: none;
      box-shadow: 0 0 0 4px rgba(47, 107, 255, 0.18);
    }

    .footer {
      padding: 30px;
      text-align: center;
    }
  }
}
</style>
