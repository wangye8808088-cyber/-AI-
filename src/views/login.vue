<template>
  <div class="container">
    <div class="title">
      <div class="back-home">
        <el-icon>
          <Back />
        </el-icon>
        <span>返回首页</span>
      </div>
      <div class="title-text">
        <h2>登陆您的账户</h2>
        <p>请输入您的登录信息</p>
      </div>
    </div>
    <div class="form-container">
      <el-form
        ref="ruleFormRef"
        :model="formData"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名或邮箱"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入密码"
            type="password"
            show-password
          />
        </el-form-item>
        <el-button
          class="btn"
          size="large"
          type="primary"
          @click="submitForm(ruleFormRef)"
          >登录</el-button
        >
      </el-form>
      <div class="footer">
        <p>还没有账户？<router-link to="/auth/register">去注册</router-link></p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { login } from "@/api/admin";
import { useRouter } from "vue-router";

const router = useRouter();

const ruleFormRef = ref();

const formData = ref({
  username: "",
  password: "",
});

const rules = ref({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

// 登录
const submitForm = async (formEl) => {
  if (!formEl) return;
  // - Element Plus 表单验证 ： validate() 方法是 Element Plus 表单组件的内置方法
  // - 回调函数 ： validate() 接受一个回调函数，参数为 valid （是否验证通过）和 fields （验证失败的字段）
  // formEl 是 el-form 组件的 **实例引用** ，具有以下作用：
  // 表单验证 ：调用 formEl.validate() 方法进行表单验证
  await formEl.validate((valid, fields) => {
    if (valid) {
      login(formData.value).then((data) => {
        // 判断toekn是否存在
        if (!data.token) {
          return console.error("登录失败");
        }
        // 登录成功: 保存token和用户信息
        localStorage.setItem("token", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
        // 根据用户角色决定跳转的路径
        if (data.userInfo.userType === 2) {
          // 跳到数据分析页面
          router.push("/back/dashboard");
        } else {
          router.push("/");
        }
      });
    }
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

  .title {
    padding-bottom: var(--hs-space-4);
    border-bottom: 1px solid rgba(45, 42, 38, 0.08);

    .back-home {
      margin-bottom: 42px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: var(--hs-text-secondary);
    }

    .title-text {
      text-align: center;

      h2 {
        font-size: clamp(30px, 4.2vw, 38px);
        margin-bottom: var(--hs-space-3);
        font-weight: 800;
        letter-spacing: 0.2px;
        color: var(--hs-text-primary);
      }

      p {
        font-size: 17px;
        color: var(--hs-text-secondary);
        line-height: 1.6;
      }
    }
  }

  .form-container {
    margin-top: var(--hs-space-8);

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
      box-shadow: 0 0 0 1px rgba(45, 42, 38, 0.1) inset;
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
      border: none;
      border-radius: var(--hs-radius-pill);
      background-color: var(--hs-primary);
      box-shadow: 0 10px 22px rgba(47, 107, 255, 0.28);
      font-weight: 700;
      letter-spacing: 0.2px;
      height: 48px;
    }

    .btn:hover {
      background-color: #245df0;
    }

    .footer {
      padding-top: var(--hs-space-8);
      text-align: center;
      color: var(--hs-text-secondary);
      font-size: 15px;

      a {
        color: var(--hs-primary);
        font-weight: 600;
      }
    }
  }
}
</style>
