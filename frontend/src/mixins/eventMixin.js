import { useEventStore } from '../stores/eventStore';
import { showConfirmDialog, showToast } from 'vant';

const getToday = () => new Date().toISOString().slice(0, 10);
const getTodayArray = () => getToday().split('-');

function padZero(value) {
  return value.toString().padStart(2, '0');
}

function getCurrentTime() {
  const now = new Date();
  return `${padZero(now.getHours())}:${padZero(now.getMinutes())}`;
}

export default {
  data() {
    return {
      selectedDate: getToday(),
      datePickerValue: getTodayArray(),
      showForm: false,
      editMode: false,
      editId: null,
      showDatePicker: false,
      form: {
        time: getCurrentTime(),
        title: '',
        description: '',
      },
      loadingText: '',
    };
  },
  computed: {
    events() {
      return this.eventStore.events;
    },
  },
  created() {
    this.eventStore = useEventStore();
    this.loadEvents();
    this.$watch('selectedDate', this.loadEvents);
  },
  methods: {
    formatDate(date) {
      const d = new Date(date);
      return d.toISOString().slice(0, 10);
    },
    async loadEvents() {
      this.loadingText = '载入中...';
      this.eventStore.setDate(this.selectedDate);
      try {
        await this.eventStore.fetchEvents();
      } finally {
        this.loadingText = '';
      }
    },
    openAddForm() {
      this.editMode = false;
      this.editId = null;
      this.form = {
        time: getCurrentTime(),
        title: '',
        description: '',
      };
      this.showForm = true;
    },
    openEditForm(event) {
      this.editMode = true;
      this.editId = event.id;
      this.form = {
        time: event.time,
        title: event.title,
        description: event.description || '',
      };
      this.showForm = true;
    },
    closeForm() {
      this.showForm = false;
    },
    validateForm() {
      if (!this.form.time) {
        showToast({ type: 'fail', message: '请填写时间' });
        return false;
      }
      if (!this.form.title.trim()) {
        showToast({ type: 'fail', message: '请填写标题' });
        return false;
      }
      return true;
    },
    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      const payload = {
        date: this.selectedDate,
        time: this.form.time,
        title: this.form.title.trim(),
        description: this.form.description.trim() || undefined,
      };
      try {
        if (this.editMode && this.editId !== null) {
          await this.eventStore.updateEvent(this.editId, payload);
        } else {
          await this.eventStore.addEvent(payload);
        }
        await this.loadEvents();
        this.closeForm();
      } catch (error) {
        showToast({ type: 'fail', message: '事件保存失败' });
        console.error(error);
      }
    },
    async removeEvent(event) {
      try {
        await showConfirmDialog({
          title: '确认删除',
          message: '确定要删除该事件吗？',
        });
        await this.eventStore.deleteEvent(event.id);
      } catch (error) {
        if (error && error !== 'confirm') {
          console.error(error);
        }
      }
    },
    onDateChange() {
      this.loadEvents();
    },
    openDatePicker() {
      this.datePickerValue = this.selectedDate.split('-');
      this.showDatePicker = true;
    },
    confirmDate(value) {
      this.selectedDate = value.join('-');
      this.showDatePicker = false;
    },
  },
};
