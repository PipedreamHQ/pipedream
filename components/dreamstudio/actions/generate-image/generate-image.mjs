import fs from "fs";
import dreamstudio from "../../dreamstudio.app.mjs";

export default {
  key: "dreamstudio-generate-image",
  name: "Generate Image",
  version: "0.0.1",
  description: "Generate a new image from a text prompt. [See the documentation](https://platform.stability.ai/docs/api-reference#tag/v1generation/operation/textToImage)",
  type: "action",
  props: {
    dreamstudio,
    organizationId: {
      propDefinition: [
        dreamstudio,
        "organizationId",
      ],
    },
    engineId: {
      propDefinition: [
        dreamstudio,
        "engineId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
    },
    textPrompts: {
      propDefinition: [
        dreamstudio,
        "textPrompts",
      ],
    },
    height: {
      propDefinition: [
        dreamstudio,
        "height",
      ],
      optional: true,
    },
    width: {
      propDefinition: [
        dreamstudio,
        "width",
      ],
      optional: true,
    },
    cfgScale: {
      propDefinition: [
        dreamstudio,
        "cfgScale",
      ],
      optional: true,
    },
    clipGuidancePreset: {
      propDefinition: [
        dreamstudio,
        "clipGuidancePreset",
      ],
      optional: true,
    },
    sampler: {
      propDefinition: [
        dreamstudio,
        "sampler",
      ],
      optional: true,
    },
    samples: {
      propDefinition: [
        dreamstudio,
        "samples",
      ],
      optional: true,
    },
    seed: {
      propDefinition: [
        dreamstudio,
        "seed",
      ],
      optional: true,
    },
    steps: {
      propDefinition: [
        dreamstudio,
        "steps",
      ],
      optional: true,
    },
    stylePreset: {
      propDefinition: [
        dreamstudio,
        "stylePreset",
      ],
      optional: true,
    },
    extras: {
      propDefinition: [
        dreamstudio,
        "extras",
      ],
      optional: true,
    },
  },
  methods: {
    parsePrompts(textPrompts) {
      if (typeof textPrompts === "object") {
        return textPrompts.map((item) => JSON.parse(item));
      }
      return JSON.parse(textPrompts);
    },
  },
  async run({ $ }) {
    const {
      dreamstudio,
      engineId,
      textPrompts,
      cfgScale,
      clipGuidancePreset,
      stylePreset,
      ...data
    } = this;

    const response = await dreamstudio.generateImage({
      $,
      engineId,
      data: {
        text_prompts: this.parsePrompts(textPrompts),
        cfg_scale: cfgScale,
        clip_guidance_preset: clipGuidancePreset,
        style_preset: stylePreset,
        ...data,
      },
    });

    response.artifacts.forEach((image) => {
      fs.writeFileSync(
        `/tmp/txt2img_${image.seed}.png`,
        Buffer.from(image.base64, "base64"),
      );
    });

    $.export("$summary", `${response.artifacts.length} new image${response.artifacts.length > 1
      ? "s where"
      : " was"} successfully generated and sent to /tmp folder!`);
    return response;
  },
};
