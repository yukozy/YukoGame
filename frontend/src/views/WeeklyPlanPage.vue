<template>
  <div class="page-shell">
    <van-nav-bar
      title="周计划"
      class="page-navbar"
      left-text="☰"
      right-text="👤"
      @click-left="showDrawer = true"
      @click-right="showUserPopup = true"
    />
    <section class="page-panel weekly-panel">
      <div class="plan-header">
        <div>
          <h2>每周待办</h2>
          <p>按天管理你的任务，并点击完成切换状态。</p>
        </div>
        <van-button type="primary" size="small" @click="showTaskForm = true"
          >新增待办</van-button
        >
      </div>

      <div class="day-tabs">
        <button
          v-for="day in days"
          :key="day"
          :class="['day-tab', { active: day === activeDay }]"
          @click="activeDay = day"
        >
          {{ day }}
        </button>
      </div>

      <div class="task-list">
        <div v-if="activeTasks.length">
          <div v-for="task in activeTasks" :key="task.id" class="task-item">
            <button
              class="task-mark"
              :class="{ done: task.done }"
              @click="toggleTask(task)"
            >
              {{ task.done ? "✔" : "待" }}
            </button>
            <div class="task-content">
              <p :class="{ completed: task.done }">{{ task.text }}</p>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          当前日暂无待办，点击“新增待办”开始添加。
        </div>
      </div>
    </section>

    <van-popup
      v-model:show="showTaskForm"
      position="bottom"
      round
      class="task-form-popup"
    >
      <div class="form-panel">
        <div class="form-header">
          <h3>新增待办</h3>
          <van-button
            plain
            type="danger"
            size="small"
            @click="showTaskForm = false"
            >取消</van-button
          >
        </div>
        <van-field label="日期" readonly v-model="activeDay" />
        <van-field
          v-model="taskText"
          label="内容"
          placeholder="请输入待办事项"
          clearable
        />
        <van-button type="primary" block class="submit-button" @click="addTask">
          添加待办
        </van-button>
      </div>
    </van-popup>

    <van-popup
      v-model:show="showUserPopup"
      position="top"
      round
      class="user-popup"
    >
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
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { showToast } from "vant";

export default {
  name: "WeeklyPlanPage",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const showDrawer = ref(false);
    const showUserPopup = ref(false);
    const showTaskForm = ref(false);
    const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
    const activeDay = ref(days[0]);
    const taskText = ref("");
    const tasks = ref({});

    const storageKey = computed(
      () => `weekly-tasks-${authStore.user?.username || "guest"}`
    );

    const defaultTasks = () => {
      return days.reduce((result, day) => {
        result[day] = [];
        return result;
      }, {});
    };

    const loadTasks = () => {
      const raw = localStorage.getItem(storageKey.value);
      if (raw) {
        const parsed = JSON.parse(raw);
        tasks.value = { ...defaultTasks(), ...parsed };
      } else {
        tasks.value = defaultTasks();
      }
    };

    const saveTasks = () => {
      localStorage.setItem(storageKey.value, JSON.stringify(tasks.value));
    };

    const activeTasks = computed(() => tasks.value[activeDay.value] || []);

    const addTask = () => {
      if (!taskText.value.trim()) {
        showToast({ type: "fail", message: "请输入待办内容" });
        return;
      }
      tasks.value[activeDay.value].push({
        id: Date.now(),
        text: taskText.value.trim(),
        done: false,
      });
      taskText.value = "";
      showTaskForm.value = false;
      saveTasks();
    };

    const toggleTask = (task) => {
      task.done = !task.done;
      saveTasks();
    };

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

    loadTasks();

    return {
      authStore,
      showDrawer,
      showUserPopup,
      showTaskForm,
      days,
      activeDay,
      taskText,
      activeTasks,
      addTask,
      toggleTask,
      logout,
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

.weekly-panel h2 {
  margin: 0 0 6px;
  font-size: 22px;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.plan-header p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 14px;
}

.day-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}

.day-tab {
  flex: 1 1 calc(33.333% - 10px);
  min-width: 92px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 18px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.86);
  color: #475569;
  font-weight: 600;
}

.day-tab.active {
  border-color: #7c3aed;
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.08);
}

.task-list {
  display: grid;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(248, 250, 252, 0.95);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.task-mark {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: #fff;
  color: #334155;
  font-size: 16px;
  font-weight: 700;
}

.task-mark.done {
  background: #7c3aed;
  color: #fff;
  border-color: rgba(124, 58, 237, 0.4);
}

.task-content p {
  margin: 0;
  line-height: 1.5;
  color: #334155;
}

.task-content p.completed {
  color: #94a3b8;
  text-decoration: line-through;
}

.empty-state {
  text-align: center;
  color: #64748b;
  padding: 32px 0;
}

.form-panel {
  padding: 18px 16px 22px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.form-header h3 {
  margin: 0;
  font-size: 18px;
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
  min-height: 100%;
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
