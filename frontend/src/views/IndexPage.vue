<template>
  <div class="page-shell">
    <van-nav-bar
      title="Time Online"
      right-text="退出"
      class="page-navbar"
      @click-right="logout"
    />
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

    <van-popup v-model:show="showDatePicker" position="bottom">
      <van-date-picker
        v-model="datePickerValue"
        :min-date="new Date('2020-01-01')"
        :max-date="new Date('2099-12-31')"
        @confirm="confirmDate"
        @cancel="showDatePicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
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
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const logout = () => {
      authStore.logout();
      router.push("/login");
    };

    return {
      logout,
      authStore,
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
</style>
