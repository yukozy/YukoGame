<template>
  <div class="page-shell">
    <section class="page-panel">
      <van-field
        label="日期"
        is-link
        readonly
        clickable
        v-model="selectedDate"
        @click="openDatePicker"
      />

      <div class="info-line">
        <span>今日事件</span>
        <small>{{ loadingText || `${events.length} 个事件` }}</small>
      </div>

      <Timeline :events="events" @edit="openEditForm" @delete="removeEvent" />
    </section>

    <van-button
      round
      block
      type="primary"
      class="fab-button"
      @click="openAddForm"
    >
      添加事件
    </van-button>

    <van-popup
      v-model:show="showForm"
      position="bottom"
      round
      class="form-popup"
    >
      <div class="form-panel">
        <div class="form-header">
          <h3>{{ editMode ? "编辑事件" : "添加事件" }}</h3>
          <van-button plain type="danger" size="small" @click="closeForm"
            >取消</van-button
          >
        </div>

        <van-field
          label="时间"
          v-model="form.time"
          placeholder="请选择时间"
          type="time"
          required
        />

        <van-field
          label="标题"
          v-model="form.title"
          placeholder="输入事件标题"
          required
        />

        <van-field
          label="描述"
          type="textarea"
          v-model="form.description"
          placeholder="可选描述"
          autosize
        />

        <van-button
          type="primary"
          block
          class="submit-button"
          @click="submitForm"
        >
          {{ editMode ? "保存修改" : "确认添加" }}
        </van-button>
      </div>
    </van-popup>

    <van-popup v-model:show="showUserPopup" position="top" round>
      <div class="user-panel">
        <div class="user-info">
          <div class="user-avatar">
            {{ authStore.user?.username?.charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="user-name">{{ authStore.user?.username }}</p>
            <p class="user-role">已登录用户</p>
          </div>
        </div>
        <van-button block type="primary" class="user-action" @click="logout"
          >退出登录</van-button
        >
      </div>
    </van-popup>
    <van-popup
      v-model:show="showDrawer"
      position="left"
      class="drawer-popup"
      style="height: 100%; width: 70%"
      round
    >
      <div class="drawer-panel drawer-full-height">
        <div class="drawer-sidebar-header">
          <div>
            <p class="drawer-title">功能导航</p>
            <p class="drawer-subtitle">快速切换页面</p>
          </div>
        </div>

        <div class="drawer-list">
          <button class="drawer-item" @click="goToIndex">
            <span class="drawer-item-icon">🕒</span>
            <span>时间线</span>
          </button>
          <button class="drawer-item" @click="goToWeekly">
            <span class="drawer-item-icon">📅</span>
            <span>周计划</span>
          </button>
        </div>

        <div class="drawer-footer">
          <button class="drawer-action">
            <span>🔍</span>
            <span>扫一扫</span>
          </button>
          <button class="drawer-action">
            <span>💬</span>
            <span>客服</span>
          </button>
          <button class="drawer-action">
            <span>⚙️</span>
            <span>设置</span>
          </button>
        </div>
      </div>
    </van-popup>
    <van-popup v-model:show="showDatePicker" position="bottom">
      <van-date-picker
        v-model="datePickerValue"
        :min-date="new Date('2020-01-01')"
        :max-date="new Date()"
        @confirm="confirmDate"
        @cancel="showDatePicker = false"
      />
    </van-popup>
  </div>
</template>

<script >
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import Timeline from "../components/Timeline.vue";
import eventMixin from "../mixins/eventMixin";

export default {
  name: "IndexPage",
  components: {
    Timeline,
  },
  mixins: [eventMixin],
  props: ["text"],
  emits: ["click"],
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const showDrawer = ref(false);
    const showUserPopup = ref(false);

    const logout = () => {
      authStore.logout();
      router.push("/login");
    };

    const closeDrawer = () => {
      showDrawer.value = false;
    };

    const goToIndex = () => {
      closeDrawer();
      router.push("/index");
    };

    const goToWeekly = () => {
      closeDrawer();
      router.push("/weekly");
    };

    return {
      logout,
      authStore,
      showDrawer,
      showUserPopup,
      closeDrawer,
      goToIndex,
      goToWeekly,
    };
  },
};
</script>

<style scoped>
.page-shell {
  min-height: 100vh;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.88),
    rgba(241, 245, 249, 0.95)
  );
  padding-bottom: 100px;
}

.page-navbar {
  background: rgba(255, 255, 255, 0.6);
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(18px);
}

.page-panel {
  padding: 20px;
  margin: 14px 14px 0;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(24px);
}

.info-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0 6px;
  color: #334155;
  font-size: 14px;
}

.fab-button {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 18px;
  width: calc(100% - 32px);
  max-width: 520px;
  border-radius: 999px;
}

.form-popup {
  padding: 0 16px;
}

.form-panel {
  padding: 18px 0 24px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.form-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.submit-button {
  margin-top: 18px;
}

.user-panel,
.drawer-panel {
  padding: 18px 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(124, 58, 237, 0.16);
  color: #7c3aed;
  display: grid;
  place-items: center;
  font-size: 22px;
  font-weight: 700;
}

.user-name {
  margin: 0;
  font-weight: 700;
}

.user-role {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 13px;
}

.user-action {
  margin-top: 10px;
}

.drawer-sidebar-header {
  padding: 18px 16px 8px;
}

.drawer-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.drawer-subtitle {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 13px;
}

.drawer-list {
  display: grid;
  gap: 12px;
  padding: 0 16px;
}

.drawer-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(226, 232, 240, 0.9);
  color: #0f172a;
  font-size: 16px;
  text-align: left;
}

.drawer-item-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(124, 58, 237, 0.08);
  color: #7c3aed;
  font-size: 18px;
}

.drawer-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 18px 16px 24px;
}

.drawer-action {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(226, 232, 240, 0.9);
  color: #334155;
  font-size: 12px;
}

.drawer-full-height {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.drawer-popup {
  height: 100%;
}

.drawer-popup .van-popup__content {
  height: 100%;
}
</style>
