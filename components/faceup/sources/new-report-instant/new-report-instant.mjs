import faceup from "../../faceup.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "faceup-new-report-instant",
  name: "New Report (Instant)",
  description: "Emit new event when a new report is created. Must create webhook within the Faceup UI and enter the URL of this source to receive events. [See the documentation](https://support.faceup.com/en/article/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    faceup,
    http: "$.interface.http",
  },
  methods: {
    generateMeta(body) {
      const { data: { report } } = body;
      return {
        id: report.id,
        summary: `New Report ID: ${report.id}`,
        ts: Date.parse(report.created_at),
      };
    },
  },
  async run(event) {
    const { body } = event;
    if (body?.event === "ReportCreated") {
      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    }
  },
  sampleEmit,
};
