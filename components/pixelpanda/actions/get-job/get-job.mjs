import pixelpanda from "../../pixelpanda.app.mjs";

export default {
  key: "pixelpanda-get-job",
  name: "Get Generation Job",
  description: "Fetch a product-photo generation job and its result image URLs. [See the documentation](https://pixelpanda.ai/developers)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pixelpanda,
    jobId: {
      propDefinition: [
        pixelpanda,
        "jobId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pixelpanda.getJob({
      $,
      jobId: this.jobId,
    });

    $.export("$summary", `Successfully retrieved job ${this.jobId}`);

    return response;
  },
};
