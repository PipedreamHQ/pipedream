import orshot from "../../orshot.app.mjs";

export default {
  key: "orshot-get-render-job",
  name: "Get Render Job",
  description: "Get an async render job by ID. When `finished` is `true`, `result` holds the render (on success) or `error` explains the failure. [See the documentation](https://orshot.com/docs/api-reference/async-render-job-get)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    orshot,
    jobId: {
      propDefinition: [
        orshot,
        "renderJobId",
      ],
    },
  },
  async run({ $ }) {
    const job = await this.orshot.getRenderJob({
      $,
      jobId: this.jobId,
    });
    $.export("$summary", `Render job ${job?.id ?? this.jobId} is ${job?.status}`);
    return job;
  },
};
