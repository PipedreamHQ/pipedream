import app from "../../leonardo_ai.app.mjs";

export default {
  key: "leonardo_ai-unzoom-image",
  name: "Unzoom Image",
  description: "Creates an unzoom variation for a generated or variation image using Leonardo AI's unzoom API.",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    imageId: {
      type: "string",
      label: "Image ID",
      description: "The ID of the image to create an unzoom variation for. This should be a previously generated or variation image ID.",
    },
    zoom: {
      type: "string",
      label: "Zoom Level",
      description: "Zoom level for the unzoom effect. Must be between 0.0 and 1.0. Higher values create more zoom out effect.",
      default: "0.5",
      optional: true,
    },
    seed: {
      type: "integer",
      label: "Seed",
      description: "Random seed for reproducible generation. Leave empty for random generation.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      imageId,
      zoom,
      seed,
    } = this;

    const data = {
      imageId,
      zoom: zoom ? parseFloat(zoom) : 0.5,
    };

    if (seed) {
      data.seed = seed;
    }

    const response = await this.app.post({
      $,
      path: "/variations/unzoom",
      data,
    });

    $.export("$summary", `Successfully created unzoom variation for image ID: ${imageId}`);
    return response;
  },
};
