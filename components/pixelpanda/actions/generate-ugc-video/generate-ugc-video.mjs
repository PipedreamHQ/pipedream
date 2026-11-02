import pixelpanda from "../../pixelpanda.app.mjs";

export default {
  key: "pixelpanda-generate-ugc-video",
  name: "Generate UGC Video",
  description: "Turn a still image into a talking UGC-style video with native AI speech and lip-sync. 50 credits. Poll with **Get Video Job**. [See the documentation](https://pixelpanda.ai/developers)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pixelpanda,
    imageUrl: {
      propDefinition: [
        pixelpanda,
        "imageUrl",
      ],
      description: "Public URL of the source image to animate (a person or avatar works best)",
    },
    script: {
      type: "string",
      label: "Spoken Script",
      description: "What the person says",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pixelpanda.generateUgcVideo({
      $,
      data: {
        image_url: this.imageUrl,
        script: this.script ?? "",
        duration: 5,
      },
    });

    $.export("$summary", `Successfully started UGC video job${response.job_id
      ? ` with ID ${response.job_id}`
      : ""}`);

    return response;
  },
};
