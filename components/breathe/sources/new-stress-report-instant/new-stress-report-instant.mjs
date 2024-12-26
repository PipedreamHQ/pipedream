import breathe from "../../breathe.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "breathe-new-stress-report-instant",
  name: "New Stress or Relaxation Report",
  description: "Emit new event when the app generates a new stress or relaxation report based on breathing activity. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    breathe: {
      type: "app",
      app: "breathe",
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  methods: {
    emitReport(report) {
      const id = report.id || String(Date.parse(report.timestamp) || Date.now());
      const summary = `New ${report.type} report generated at ${report.timestamp}`;
      const ts = Date.parse(report.timestamp) || Date.now();

      this.$emit(report, {
        id: id.toString(),
        summary,
        ts,
      });
    },
  },
  hooks: {
    async deploy() {
      // Fetch the 50 most recent stress or relaxation reports
      const reports = await this.breathe.paginate(async (opts) => {
        return await this.breathe._makeRequest({
          method: "GET",
          path: "/reports",
          params: {
            type: "stress_relaxation",
            limit: 50,
            ...opts,
          },
        });
      });

      // Emit each report from oldest to most recent
      reports
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .forEach((report) => {
          this.emitReport(report);
        });
    },
    async activate() {
      // Create a webhook subscription for report_generated events
      const webhookUrl = this.http.endpoint;
      const response = await this.breathe._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          event: "report_generated",
          url: webhookUrl,
        },
      });

      // Save the webhook ID for future reference
      await this.db.set("webhookId", response.id);
    },
    async deactivate() {
      // Retrieve the stored webhook ID
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        // Delete the webhook subscription
        await this.breathe._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });

        // Remove the webhook ID from the database
        await this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const report = event;

    // Validate the report type
    if (report.type === "stress" || report.type === "relaxation") {
      this.emitReport(report);
    }
  },
};
