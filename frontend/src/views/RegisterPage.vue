<template>
  <div class="auth-shell">
    <van-nav-bar title="注册" class="page-navbar" />
    <section class="auth-panel">
      <van-field
        v-model="username"
        label="用户名"
        placeholder="请输入用户名"
        clearable
      />
      <van-field
        v-model="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
      />
      <van-button type="primary" block class="auth-button" @click="onRegister">
        注册
      </van-button>
      <div class="auth-footer">
        已有账户？
        <router-link to="/login">去登录</router-link>
      </div>
    </section>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { showToast } from "vant";

export default {
  name: "RegisterPage",
  setup() {
    const username = ref("");
    const password = ref("");
    const router = useRouter();
    const authStore = useAuthStore();

    const validate = () => {
      if (!username.value.trim()) {
        showToast({ type: "fail", message: "请输入用户名" });
        return false;
      }
      if (!password.value.trim()) {
        showToast({ type: "fail", message: "请输入密码" });
        return false;
      }
      if (password.value.length < 8) {
        showToast({ type: "fail", message: "密码至少 8 位" });
        return false;
      }
      return true;
    };

    const onRegister = async () => {
      if (!validate()) {
        return;
      }
      try {
        await authStore.register({
          username: username.value.trim(),
          password: password.value,
        });
        router.push("/index");
      } catch (error) {
        showToast({ type: "fail", message: authStore.error || "注册失败" });
      }
    };

    return {
      username,
      password,
      onRegister,
    };
  },
};
</script>

<style scoped>
.auth-shell {
  min-height: 100vh;
  background: radial-gradient(
      circle at top left,
      rgba(114, 136, 255, 0.24),
      transparent 28%
    ),
    radial-gradient(
      circle at bottom right,
      rgba(243, 114, 125, 0.16),
      transparent 24%
    ),
    linear-gradient(180deg, #eef2ff 0%, #f8f4ff 40%, #ffffff 100%);
  padding-bottom: 24px;
}

.page-navbar {
  background: rgba(255, 255, 255, 0.6);
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

.auth-panel {
  margin: 24px 16px;
  padding: 24px 20px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 24px 60px rgba(53, 73, 132, 0.14);
  backdrop-filter: blur(24px);
}

.auth-button {
  margin-top: 18px;
}

.auth-footer {
  margin-top: 18px;
  font-size: 14px;
  color: rgba(55, 65, 81, 0.8);
  text-align: center;
}

.auth-footer a {
  color: #7c3aed;
  font-weight: 500;
}
</style>
