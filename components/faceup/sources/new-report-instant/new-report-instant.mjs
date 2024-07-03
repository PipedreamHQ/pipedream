import faceup from "../../faceup.app.mjs";

export default {
  key: "faceup-new-report-instant",
  name: "New Report Instant",
  description: "Emit new event when a new report is created. [See the documentation](https://support.faceup.com/en/article/webhooks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    faceup: {
      type: "app",
      app: "faceup",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    reportId: {
      propDefinition: [
        faceup,
        "reportId",
      ],
    },
    reportType: {
      propDefinition: [
        faceup,
        "reportType",
      ],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const webhook = await this.faceup._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          name: "New Report Instant",
          url: this.http.endpoint,
          event: "ReportCreated",
        },
      });
      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      await this.faceup._makeRequest({
        method: "DELETE",
        path: `/webhooks/${this.db.get("webhookId")}`,
      });
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (headers["X-Faceup-Signature"] !== this.faceup.$auth.api_key) {
      return this.http.respond({
        status: 401,
      });
    }

    if (body.event_type === "report.created" && body.data.id === this.reportId) {
      this.$emit(body, {
        id: body.data.id,
        summary: `New report created: ${body.data.id}`,
        ts: Date.now(),
      });
    }
  },
};
