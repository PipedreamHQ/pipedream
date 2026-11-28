import app from "../../shotstack.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "shotstack-generate-asset",
  name: "Generate Asset",
  description: "Generate one AI image, video or audio file from a prompt, to use as an asset in a later render. Shotstack bills credits for it in Sandbox and in Production; use **Quote Generation** first to see the cost. Returns the job: its `id` and `status` (`done` with a `url` straight away when the same asset was generated before, which is not billed again). Otherwise use **Get Generation Status** with the `id` (and `waitSeconds`) to get the URL. Use **List Generation Models** to pick a model and its options. [See the documentation](https://shotstack.io/docs/api/#generate-asset)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    assetType: {
      propDefinition: [
        app,
        "assetType",
      ],
    },
    prompt: {
      propDefinition: [
        app,
        "prompt",
      ],
    },
    model: {
      propDefinition: [
        app,
        "model",
        (c) => ({
          assetType: c.assetType,
        }),
      ],
    },
    modelOptions: {
      propDefinition: [
        app,
        "modelOptions",
      ],
    },
    length: {
      propDefinition: [
        app,
        "length",
      ],
    },
  },
  async run({ $ }) {
    const job = await this.app.generateAsset({
      $,
      data: utils.generationBody(this),
    });
    const summary = utils.statusSummary("Generation", job);
    $.export("$summary", utils.isGenerationFinal(job)
      ? summary
      : `${summary}. Use Get Generation Status to get the URL.`);
    return job;
  },
};
