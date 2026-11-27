import fonciq from "../../fonciq.app.mjs";
import { APP_DESCRIPTION_FR, APP_DESCRIPTION_EN } from "../../common/copy.mjs";

export default {
  key: "fonciq-get-job",
  name: "Get Job",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  description: `${APP_DESCRIPTION_FR} GET /v1/jobs/{id}. / ${APP_DESCRIPTION_EN} GET /v1/jobs/{id}.`,
  props: {
    fonciq,
    jobId: {
      propDefinition: [fonciq, "jobId"],
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
    $.export("$summary", `Job ${jobId}: ${job.status}`);
    return job;
  },
};


