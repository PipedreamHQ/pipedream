import app from "../../shotstack.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "shotstack-quote-generation",
  name: "Quote Generation",
  description: "Estimate the credits a **Generate Asset** call with the same inputs would cost. Starts no job and spends nothing. Returns `credits`. [See the documentation](https://shotstack.io/docs/api/#quote-generation)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const quote = await this.app.quoteGeneration({
      $,
      data: utils.generationBody(this),
    });
    $.export("$summary", `This generation would cost ${quote.credits} credits`);
    return quote;
  },
};
