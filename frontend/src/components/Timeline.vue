<template>
  <section class="timeline">
    <div v-if="!events.length" class="empty-state">
      今天还没有事件，点击下方按钮添加。
    </div>
    <div v-for="event in events" :key="event.id" class="timeline-item">
      <div class="timeline-marker">
        <span class="timeline-dot"></span>
        <span class="timeline-line"></span>
      </div>
      <div class="event-card">
        <div class="event-meta">
          <div class="event-time">{{ event.time }}</div>
          <div class="event-actions">
            <button
              type="button"
              class="icon-button"
              @click="$emit('edit', event)"
            >
              ✏️
            </button>
            <button
              type="button"
              class="icon-button delete"
              @click="$emit('delete', event)"
            >
              🗑️
            </button>
          </div>
        </div>
        <div class="event-title">{{ event.title }}</div>
        <p v-if="event.description" class="event-description">
          {{ event.description }}
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Timeline",
  props: {
    events: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.timeline {
  padding: 0 16px 100px;
}

.empty-state {
  margin: 24px 0;
  color: #666;
  text-align: center;
  font-size: 14px;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 22px;
}

.timeline-marker {
  position: relative;
  width: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #3b82f6;
  margin-top: 6px;
}

.timeline-line {
  flex: 1;
  width: 2px;
  margin-top: 4px;
  background: #dbeafe;
}

.event-card {
  flex: 1;
  background: #ffffff;
  border-radius: 18px;
  padding: 14px 16px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
}

.event-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.event-time {
  font-size: 14px;
  color: #2563eb;
  font-weight: 600;
}

.event-actions {
  display: flex;
  gap: 8px;
}

.icon-button {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

.icon-button.delete {
  color: #ef4444;
}

.event-title {
  margin-top: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.event-description {
  margin-top: 8px;
  color: #475569;
  line-height: 1.5;
  font-size: 14px;
}
</style>
