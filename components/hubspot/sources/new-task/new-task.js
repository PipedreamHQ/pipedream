const hubspot = require("../../hubspot.app.js");

module.exports = {
  key: "hubspot-new-task",
  name: "New Calendar Task",
  description: "Emits an event for each new task added.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    hubspot,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  async run(event) {
    const yearFromNow = new Date();
    yearFromNow.setFullYear(yearFromNow.getFullYear() + 1);

    const results = await this.hubspot.getCalendarTasks(yearFromNow.getTime());
    for (const task of results) {
      this.$emit(task, {
        id: task.id,
        summary: `${task.name} - ${task.eventType}`,
        ts: Date.now(),
      });
    }
  },
};