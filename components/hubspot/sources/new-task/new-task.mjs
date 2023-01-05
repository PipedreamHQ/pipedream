import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-new-task",
  name: "New Calendar Task",
  description: "Emit new event for each new task added.",
  version: "0.0.10",
  dedupe: "unique",
  type: "source",
  hooks: {},
  methods: {
    ...common.methods,
    generateMeta(task) {
      const {
        id,
        name,
        eventType,
      } = task;
      return {
        id,
        summary: `${name} - ${eventType}`,
        ts: Date.now(),
      };
    },
    getParams() {
      const yearFromNow = new Date();
      yearFromNow.setFullYear(yearFromNow.getFullYear() + 1);
      return yearFromNow.getTime();
    },
    async processResults(after, params) {
      const results = await this.hubspot.getCalendarTasks(params);
      for (const task of results) {
        const meta = this.generateMeta(task);
        this.$emit(task, meta);
      }
    },
  },
};
