import postman from "../../postman.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "postman-monitor-run-completed",
  name: "New Monitor Run Completed",
  description: "Emit new event when a monitor run is completed. [See the documentation](https://learning.postman.com/docs/monitoring-your-api/intro-monitors/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    postman,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    monitorId: {
      propDefinition: [
        postman,
        "monitorId",
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || new Date("1970-01-01");
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async startEvent() {
      const lastDate = this._getLastDate();

      const { monitor } = await this.postman.getMonitor({
        monitorId: this.monitorId,
      });

      if (monitor.lastRun?.status === "success" && new Date(monitor.lastRun.startedAt) > new Date(lastDate)) {
        this._setLastDate(monitor.lastRun.startedAt);
        this.emitEvent(monitor);
      }
    },
    emitEvent(monitor) {
      this.$emit(monitor, {
        id: monitor.id + monitor.lastRun.startedAt,
        summary: `Monitor Run Completed: ${monitor.name}`,
        ts: Date.parse(monitor.lastRun.finishedAt),
      });
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
