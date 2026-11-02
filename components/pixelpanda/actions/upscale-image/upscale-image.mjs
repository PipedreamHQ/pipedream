import pixelpanda from "../../pixelpanda.app.mjs";

export default {
  key: "pixelpanda-upscale-image",
  name: "Upscale Image",
  description: "Increase image resolution 2x, 4x or 8x with AI. 1 credit (8x costs 2). [See the documentation](https://pixelpanda.ai/developers)",
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
    scale: {
      type: "integer",
      label: "Scale Factor",
      description: "How much to enlarge the image",
      options: [
        {
          label: "2x",
          value: 2,
        },
        {
          label: "4x",
          value: 4,
        },
        {
          label: "8x (2 credits)",
          value: 8,
        },
      ],
      default: 2,
    },
    quality: {
      type: "string",
      label: "Quality",
      description: "Processing mode. `fast` uses Real-ESRGAN (~2s), `balanced` and `high` use Clarity Upscaler for more detail",
      options: [
        "fast",
        "balanced",
        "high",
      ],
      default: "fast",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pixelpanda.upscaleImage({
      $,
      data: {
        image_url: this.imageUrl,
        scale: this.scale,
        quality: this.quality,
      },
    });

    $.export("$summary", `Successfully upscaled image ${this.scale}x`);

    return response;
  },
};
