import ocrspace from "../../ocrspace.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ocrspace-new-ocr-job-completed-instant",
  name: "New OCR Job Completed",
  description: "Emit new event when an OCR job is completed. [See the documentation](https://ocr.space/ocrapi)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ocrspace: {
      type: "app",
      app: "ocrspace",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      console.log(`Please configure your OCRSpace webhook URL to: ${this.http.endpoint}`);
    },
    async deactivate() {
      console.log("Webhook deactivated. Please remove the webhook URL from your OCRSpace settings.");
    },
    async deploy() {
      const lastJobId = await this.db.get("lastJobId");
      if (lastJobId) {
        try {
          const job = await this.ocrspace.retrieveOcrResult({
            jobId: lastJobId,
          });
          this.$emit(job, {
            id: job.jobId || lastJobId,
            summary: `OCR job completed: ${job.jobId || lastJobId}`,
            ts: Date.now(),
          });
        } catch (error) {
          console.error(`Failed to retrieve OCR job with ID ${lastJobId}:`, error);
        }
      }
    },
  },
  async run(event) {
    const job = event;
    const jobId = job.jobId || job.id || null;
    const summary = jobId
      ? `OCR job completed: ${jobId}`
      : "OCR job completed";
    const ts = job.completedAt
      ? Date.parse(job.completedAt)
      : Date.now();

    this.$emit(job, {
      id: jobId || ts.toString(),
      summary,
      ts,
    });

    if (jobId) {
      await this.db.set("lastJobId", jobId);
    }
  },
};
