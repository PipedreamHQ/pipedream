import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-new-timesheet-entry",
  name: "New Timesheet Entry",
  description: "Emit new notifications when a new timesheet is created",
  version: "0.0.1",
  type: "source",
  props: {
    harvest,
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll Harvest API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
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
    const entries = await this.harvest.listTimeEntriesPaginated({
      page: 1,
      updatedSince: lastDateChecked,
    });
    for await (const entry of entries) {
      data.push(entry);
    }
    data && data.reverse().forEach((entry) => {
      this.harvest.setLastDateChecked(this.db, entry.updated_at);
      this.$emit(entry,
        {
          id: entry.id,
          summary: `Task: ${entry.task.name} - ${entry.spent_date} ${entry.started_time || ""} ${entry.ended_time
            ? " to " + entry.ended_time
            : ""}`,
        });
    });
  },
};
