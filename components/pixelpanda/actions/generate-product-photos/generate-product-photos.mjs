import pixelpanda from "../../pixelpanda.app.mjs";

export default {
  key: "pixelpanda-generate-product-photos",
  name: "Generate Product Photos",
  description: "Turn one product image into AI lifestyle/studio scene photos. 1 credit per photo. Returns a job — poll it with **Get Generation Job**. [See the documentation](https://pixelpanda.ai/developers)",
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
    },
    numScenes: {
      type: "integer",
      label: "Number Of Photos",
      description: "How many scene photos to generate (1-12)",
      min: 1,
      max: 12,
      default: 4,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pixelpanda.generateProductPhotos({
      $,
      data: {
        image_url: this.imageUrl,
        num_scenes: this.numScenes,
      },
    });

    $.export("$summary", `Successfully started product photo job${response.job_id
      ? ` with ID ${response.job_id}`
      : ""}`);

    return response;
  },
};
