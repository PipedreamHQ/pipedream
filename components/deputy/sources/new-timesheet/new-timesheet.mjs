import deputy from "../../deputy.app.mjs";

export default {
  key: "deputy-new-timesheet",
  name: "New Timesheet",
  description: "Emits an event when a new timesheet has been saved",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    deputy,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    user: {
      propDefinition: [
        deputy,
        "user",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Get most recent timesheet
      const { timesheets } = await this.deputy.getTimesheets(this);
      if (timesheets.length > 0) {
        this.db.set("lastTimesheetId", timesheets[0].id);
      }
    },
  },
  methods: {
    ...deputy.methods,
  },
  async run() {
    const { timesheets } = await this.deputy.getTimesheets(this);

    for (const timesheet of timesheets) {
      // Check if new timesheet
      if (timesheet.id > this.db.get("lastTimesheetId")) {
        this.$emit(timesheet, {
          id: timesheet.id,
          summary: `New Timesheet ${timesheet.id}`,
          ts: Date.parse(timesheet.startTime),
        });
      }
    }

    // Update lastTimesheetId
    if (timesheets.length > 0) {
      this.db.set("lastTimesheetId", timesheets[0].id);
    }
  },
};
