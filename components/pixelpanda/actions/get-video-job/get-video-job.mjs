import pixelpanda from "../../pixelpanda.app.mjs";

export default {
  key: "pixelpanda-get-video-job",
  name: "Get Video Job",
  description: "Fetch a UGC video job and its finished video URL. [See the documentation](https://pixelpanda.ai/developers)",
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
    const response = await this.pixelpanda.getVideoJob({
      $,
      jobId: this.jobId,
    });

    $.export("$summary", `Successfully retrieved video job ${this.jobId}`);

    return response;
  },
};
