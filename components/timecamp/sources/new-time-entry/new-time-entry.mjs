import timecamp from "../../timecamp.app.mjs";
import dayjs from "dayjs";

export default {
  name: "New Time Entry",
  version: "0.0.1",
  key: "timecamp-new-time-entry",
  description: "Emit new event on each created time entry.",
  type: "source",
  dedupe: "unique",
  props: {
    timecamp,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  methods: {
    _getLastSyncDate() {
      return this.db.get("lastSyncDate");
    },
    _setLastSyncDate(lastSyncDate) {
      return this.db.set("lastSyncDate", lastSyncDate);
    },
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New time entry with id ${data.id}`,
        ts: Date.parse(data.add_date),
      });
    },
    async emitTimeEntries() {
      const lastSyncDate = this._getLastSyncDate();

      const timeEntries = await this.timecamp.getTimeEntries({
        params: {
          from: lastSyncDate,
          to: dayjs().format("YYYY-MM-DD"),
        },
      });

      timeEntries.reverse().forEach(this.emitEvent);
    },
  },
  hooks: {
    async deploy() {
      const lastSyncDate = dayjs().subtract(1, "month")
        .format("YYYY-MM-DD");

      this._setLastSyncDate(lastSyncDate);

      await this.emitTimeEntries();
    },
  },
  async run() {
    await this.emitTimeEntries();

    const lastSyncDate = dayjs().format("YYYY-MM-DD");

    this._setLastSyncDate(lastSyncDate);
  },
};
