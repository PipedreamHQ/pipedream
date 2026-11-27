import app from "../../popnow.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "popnow-quote-job",
  name: "Quote Job",
  description: "Validate a generation request and price it in USD without creating a task or holding any funds. The returned `maxChargeUsd` is the most the task can cost. [See the documentation](https://popnow.ai/docs/billing#quote)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    modality: {
      propDefinition: [
        app,
        "modality",
      ],
    },
    model: {
      propDefinition: [
        app,
        "model",
        ({ modality }) => ({
          modality,
        }),
      ],
    },
    input: {
      propDefinition: [
        app,
        "input",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.quoteJob({
      $,
      data: {
        model: this.model,
        input: parseObject(this.input),
      },
    });
    $.export("$summary", `Successfully quoted \`${this.model}\` at up to $${response?.maxChargeUsd} (typical $${response?.expectedChargeUsd})`);
    return response;
  },
};
