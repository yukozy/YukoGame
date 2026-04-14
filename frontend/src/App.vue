<template>
  <div class="app-shell">
    <header class="topbar">
      <div>
        <p class="page-title">时间轴记录</p>
        <p class="subtitle">请选择日期，查看当天事件</p>
      </div>
      <input
        type="date"
        v-model="selectedDate"
        @change="onDateChange"
        class="date-picker"
      />
    </header>

    <main class="content">
      <Timeline
        :events="eventStore.events"
        @edit="openEditForm"
        @delete="removeEvent"
      />
    </main>

    <button class="fab" @click="openAddForm">＋</button>

    <div v-if="showForm" class="modal-backdrop" @click.self="closeForm">
      <div class="modal-card">
        <div class="modal-header">
          <h2>{{ editMode ? "编辑事件" : "添加事件" }}</h2>
          <button type="button" class="close-button" @click="closeForm">
            ×
          </button>
        </div>

        <form @submit.prevent="submitForm" class="event-form">
          <label>
            时间
            <input type="time" v-model="form.time" required />
          </label>
          <label>
            标题
            <input
              type="text"
              v-model="form.title"
              placeholder="输入事件标题"
              required
            />
          </label>
          <label>
            描述
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="可选描述"
            ></textarea>
          </label>

          <button type="submit" class="primary-button">
            {{ editMode ? "保存修改" : "添加事件" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { useEventStore } from "./stores/eventStore";
import Timeline from "./components/Timeline.vue";

export default {
  name: "App",
  components: { Timeline },
  setup() {
    const eventStore = useEventStore();
    const selectedDate = ref(eventStore.currentDate);
    const showForm = ref(false);
    const editMode = ref(false);
    const editId = ref(null);
    const form = ref({ time: "", title: "", description: "" });

    const loadEvents = async () => {
      eventStore.setDate(selectedDate.value);
      await eventStore.fetchEvents();
    };

    const openAddForm = () => {
      editMode.value = false;
      editId.value = null;
      form.value = { time: "09:00", title: "", description: "" };
      showForm.value = true;
    };

    const openEditForm = (event) => {
      editMode.value = true;
      editId.value = event.id;
      form.value = {
        time: event.time,
        title: event.title,
        description: event.description || "",
      };
      showForm.value = true;
    };

    const closeForm = () => {
      showForm.value = false;
    };

    const submitForm = async () => {
      const payload = {
        date: selectedDate.value,
        time: form.value.time,
        title: form.value.title.trim(),
        description: form.value.description.trim() || undefined,
      };

      try {
        if (editMode.value && editId.value !== null) {
          await eventStore.updateEvent(editId.value, payload);
        } else {
          await eventStore.addEvent(payload);
        }
        await loadEvents();
        closeForm();
      } catch (error) {
        console.error(error);
      }
    };

    const removeEvent = async (event) => {
      if (window.confirm("确认删除该事件？")) {
        await eventStore.deleteEvent(event.id);
      }
    };

    const onDateChange = () => {
      loadEvents();
    };

    onMounted(loadEvents);

    watch(selectedDate, (newDate) => {
      eventStore.setDate(newDate);
    });

    return {
      eventStore,
      selectedDate,
      showForm,
      editMode,
      form,
      openAddForm,
      openEditForm,
      closeForm,
      submitForm,
      removeEvent,
      onDateChange,
    };
  },
};
</script>

<style scoped>
:root {
  color-scheme: light;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f8fafc;
  color: #0f172a;
}

.app-shell {
  min-height: 100vh;
  padding-bottom: 100px;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #ffffff;
  padding: 20px 16px 16px;
  border-bottom: 1px solid #e2e8f0;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.subtitle {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 14px;
}

.date-picker {
  margin-top: 14px;
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid #cbd5e1;
  font-size: 16px;
  color: #0f172a;
  background: #f8fafc;
}

.content {
  padding: 16px 0 0;
}

.fab {
  position: fixed;
  right: 18px;
  bottom: 24px;
  width: 62px;
  height: 62px;
  border: none;
  border-radius: 50%;
  background: #2563eb;
  color: #ffffff;
  font-size: 32px;
  line-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 18px 38px rgba(37, 99, 235, 0.24);
  cursor: pointer;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0 16px 20px;
}

.modal-card {
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  border-radius: 24px 24px 16px 16px;
  padding: 20px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
}

.close-button {
  border: none;
  background: transparent;
  font-size: 28px;
  color: #334155;
  cursor: pointer;
}

.event-form {
  display: grid;
  gap: 16px;
}

.event-form label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #334155;
}

.event-form input,
.event-form textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  padding: 12px 14px;
  font-size: 15px;
  color: #0f172a;
  background: #f8fafc;
}

.event-form textarea {
  resize: none;
}

.primary-button {
  width: 100%;
  border: none;
  border-radius: 14px;
  padding: 14px 0;
  color: #ffffff;
  background: #2563eb;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 420px) {
  .topbar {
    padding: 16px 12px 12px;
  }

  .date-picker {
    font-size: 15px;
  }
}
</style>
