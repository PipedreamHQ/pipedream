import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Updated Time Entry (Instant)",
  version: "0.0.3",
  key: "awork-new-updated-time-entry",
  description: "Emit new event on each updated time entry.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "timetracking_updated";
    },
    async deploy() {
      const timeEntries = await this.awork.getTimeEntries({
        params: {
          pageSize: 10,
          orderby: "CreatedOn DESC",
        },
      });

      timeEntries
        .filter((timeEntry) => timeEntry.createdOn !== timeEntry.updatedOn)
        .reverse()
        .forEach(this.emitEvent);
    },
    emitEvent(body) {
      const data = body?.entity ?? body;

      this.$emit(data, {
        id: `${data.id}-${data.updatedOn}`,
        summary: `New time entry updated with id ${data.id}`,
        ts: Date.parse(data.createdOn),
      });
    },
  },
};
