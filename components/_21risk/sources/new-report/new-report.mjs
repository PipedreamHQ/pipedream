import { axios } from "@pipedream/platform";
import _21risk from "../../_21risk.app.mjs";

export default {
  key: "_21risk-new-report",
  name: "New Report Created",
  description: "Emit new event when a new report is created. [See the documentation](https://api.21risk.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    _21risk,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 900, // Default polling interval of 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      const reports = await this._21risk.emitNewReportEvent();
      for (const report of reports.slice(0, 50)) {
        this.$emit(report, {
          id: report.id,
          summary: `New Report: ${report.name}`,
          ts: new Date(report.createdAt).getTime(),
        });
      }
    },
    async activate() {
      // Code for activation if needed
    },
    async deactivate() {
      // Code for deactivation if needed
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    _setLastTimestamp(ts) {
      this.db.set("lastTimestamp", ts);
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    const reports = await this._21risk.emitNewReportEvent({
      params: {
        $filter: `createdAt gt ${new Date(lastTimestamp).toISOString()}`,
      },
    });

    for (const report of reports) {
      this.$emit(report, {
        id: report.id,
        summary: `New Report: ${report.name}`,
        ts: new Date(report.createdAt).getTime(),
      });
    }

    if (reports.length > 0) {
      const latestReport = reports[reports.length - 1];
      this._setLastTimestamp(new Date(latestReport.createdAt).getTime());
    }
  },
};
