import Lastpass from "../../lastpass.app.mjs";

export default {
  key: "lastpass-new-watch-events",
  name: "New Watch Events",
  description: "Emit new event when a new report is generated in LastPass",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    lastpass: {
      type: "app",
      app: "lastpass",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    userLogin: Lastpass.propDefinitions.userLogin,
    pushedSite: Lastpass.propDefinitions.pushedSite,
  },
  methods: {
    _getReportId() {
      return this.db.get("reportId") || null;
    },
    _setReportId(id) {
      this.db.set("reportId", id);
    },
  },
  async run() {
    const {
      userLogin, pushedSite,
    } = this;
    const report = await this.lastpass.generateReport({
      userLogin,
      pushedSite,
    });
    const reportId = report.id;
    const lastReportId = this._getReportId();

    if (reportId !== lastReportId) {
      this.$emit(report, {
        id: reportId,
        summary: `New report generated: ${reportId}`,
        ts: Date.now(),
      });
      this._setReportId(reportId);
    }
  },
};
