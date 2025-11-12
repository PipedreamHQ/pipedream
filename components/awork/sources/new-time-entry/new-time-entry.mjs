import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Time Entry (Instant)",
  version: "0.0.3",
  key: "awork-new-time-entry",
  description: "Emit new event on each created time entry.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "timetracking_added";
    },
    async deploy() {
      const timeEntries = await this.awork.getTimeEntries({
        params: {
          pageSize: 10,
          orderby: "CreatedOn DESC",
        },
      });

      timeEntries
        .reverse()
        .forEach(this.emitEvent);
    },
    emitEvent(body) {
      const data = body?.entity ?? body;

      this.$emit(data, {
        id: data.id,
        summary: `New time entry created with id ${data.id}`,
        ts: Date.parse(data.createdOn),
      });
    },
  },
};
