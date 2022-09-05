import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-new-timeentry-entry",
  name: "New Time Entry",
  description: "Emit new notifications when a new time entry is created",
  version: "0.0.1",
  type: "source",
  props: {
    harvest,
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll Harvest API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    db: "$.service.db",
  },
  dedupe: "unique",
  async run() {
    const data = [];
    let lastDateChecked = this.harvest.getLastDateChecked(this.db);
    if (!lastDateChecked) {
      lastDateChecked = new Date().toISOString();
      this.harvest.setLastDateChecked(this.db, lastDateChecked);
    }
    const time_entries = await this.harvest.listTimeEntriesPaginated({
      page: 1,
      updatedSince: lastDateChecked,
    });
    for await (const time_entry of time_entries) {
      data.push(time_entry);
    }
    data && data.reverse().forEach((time_entry) => {
      this.harvest.setLastDateChecked(this.db, time_entry.updated_at);
      this.$emit(time_entry,
        {
          id: time_entry.id,
          summary: `Time Entry id: ${time_entry.id}`,
          ts: Date.parse(time_entry.updated_at),
        });
    });
  },
};
