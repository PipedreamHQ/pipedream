import fonciq from "../../fonciq.app.mjs";
import { APP_DESCRIPTION_FR, APP_DESCRIPTION_EN } from "../../common/copy.mjs";

export default {
  key: "fonciq-document-completed",
  name: "Document Completed",
  version: "0.0.1",
  type: "source",
  description: `Triggers when GET /v1/jobs/{id} reports status succeeded. ${APP_DESCRIPTION_FR} Fournissez le job_id de POST /v1/registre/requests ou POST /v1/batches. / ${APP_DESCRIPTION_EN} Pass job_id from POST /v1/registre/requests or POST /v1/batches.`,
  dedupe: "unique",
  props: {
    fonciq,
    db: "$.service.db",
    jobId: {
      propDefinition: [fonciq, "jobId"],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 5 * 60,
      },
    },
  },
  hooks: {
    async deploy() {},
    async deactivate() {},
  },
  methods: {
    async loadLastStatus() {
      return this.db.get("lastStatus");
    },
    async saveLastStatus(status) {
      await this.db.set("lastStatus", status);
    },
  },
  async run({ $ }) {
    const jobId = (this.jobId || "").trim();
    if (!jobId) {
      throw new Error("jobId est requis. / jobId is required.");
    }

    const job = await this.fonciq.fonciqRequest($, {
      path: `/v1/jobs/${encodeURIComponent(jobId)}`,
    });

    const prev = await this.loadLastStatus();
    await this.saveLastStatus(job.status);

    if (job.status !== "succeeded") {
      return;
    }
    if (prev === "succeeded") {
      return;
    }

    this.$emit(job, {
      id: job.id || jobId,
      summary: `Document terminé / Document completed: ${jobId}`,
      ts: Date.now(),
    });
  },
};


