// x-pd-ai: optimized
import canva from "../../canva.app.mjs";

export default {
  key: "canva-get-design-autofill-job",
  name: "Get Design Autofill Job",
  description: "Check the status and result of an autofill job via GET /autofills/{jobId} as a standalone lookup. Run **Create Design Autofill Job** first to obtain the job ID. [See the documentation](https://www.canva.dev/docs/connect/api-reference/autofills/get-design-autofill-job/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    canva,
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the autofill job. Run **Create Design Autofill Job** first to obtain it.",
    },
  },
  async run({ $ }) {
    const response = await this.canva.getAutofillJob({
      $,
      jobId: this.jobId,
    });
    $.export("$summary", `Autofill job "${this.jobId}" status: ${response.job?.status?.state ?? "unknown"}`);
    return response;
  },
};
