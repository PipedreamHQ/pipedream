import {
  parsePrompts, writeImg,
} from "../../common/utils.mjs";
import common from "../common/images.mjs";

export default {
  ...common,
  key: "dreamstudio-generate-image",
  name: "Generate Image",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Generate a new image from a text prompt. [See the documentation](https://platform.stability.ai/docs/api-reference#tag/v1generation/operation/textToImage)",
  type: "action",
  props: {
    ...common.props,
    textPrompts: {
      propDefinition: [
        common.props.dreamstudio,
        "textPrompts",
      ],
    },
    height: {
      propDefinition: [
        common.props.dreamstudio,
        "height",
      ],
      optional: true,
    },
    width: {
      propDefinition: [
        common.props.dreamstudio,
        "width",
      ],
      optional: true,
    },
    cfgScale: {
      propDefinition: [
        common.props.dreamstudio,
        "cfgScale",
      ],
      optional: true,
    },
    clipGuidancePreset: {
      propDefinition: [
        common.props.dreamstudio,
        "clipGuidancePreset",
      ],
      optional: true,
    },
    sampler: {
      propDefinition: [
        common.props.dreamstudio,
        "sampler",
      ],
      optional: true,
    },
    samples: {
      propDefinition: [
        common.props.dreamstudio,
        "samples",
      ],
      optional: true,
    },
    seed: {
      propDefinition: [
        common.props.dreamstudio,
        "seed",
      ],
      optional: true,
    },
    steps: {
      propDefinition: [
        common.props.dreamstudio,
        "steps",
      ],
      optional: true,
    },
    stylePreset: {
      propDefinition: [
        common.props.dreamstudio,
        "stylePreset",
      ],
      optional: true,
    },
    extras: {
      propDefinition: [
        common.props.dreamstudio,
        "extras",
      ],
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
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
        text_prompts: parsePrompts(textPrompts),
        cfg_scale: cfgScale,
        clip_guidance_preset: clipGuidancePreset,
        style_preset: stylePreset,
        ...data,
      },
    });

    const paths = await writeImg(response.artifacts);

    $.export("$summary", `${response.artifacts.length} new image${response.artifacts.length > 1
      ?
      "s where"
      :
      " was"} successfully generated and sent to ${paths.toString()}!`);

    return {
      ...response,
      tmpPaths: paths,
    };
  },
};
