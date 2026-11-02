import pixelpanda from "../../pixelpanda.app.mjs";

export default {
  key: "pixelpanda-get-ad-pack",
  name: "Get Ad Pack",
  description: "Fetch an ad pack job with its photos, video, static ads and captions. [See the documentation](https://pixelpanda.ai/developers)",
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
    const response = await this.pixelpanda.getAdPack({
      $,
      jobId: this.jobId,
    });

    $.export("$summary", `Successfully retrieved ad pack ${this.jobId}`);

    return response;
  },
};
