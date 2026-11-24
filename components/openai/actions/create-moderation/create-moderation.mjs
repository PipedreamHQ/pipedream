import openai from "../../openai.app.mjs";
import { MODERATION_MODELS } from "../../common/models.mjs";

export default {
  key: "openai-create-moderation",
  name: "Create Moderation",
  description: "Classify text before publishing or processing it. Returns whether the input was flagged and the scores by category. [See the documentation](https://platform.openai.com/docs/api-reference/moderations/create)",
  version: "0.0.14",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    openai,
    input: {
      type: "string",
      label: "Input",
      description: "Text to classify, e.g. `A public comment awaiting review.`.",
    },
    model: {
      type: "string",
      label: "Model",
      description: "OpenAI moderation model, e.g. `omni-moderation-latest`.",
      options: MODERATION_MODELS,
      default: "omni-moderation-latest",
    },
  },
  async run({ $ }) {
    const response = await this.openai.createModeration({
      $,
      data: {
        input: this.input,
        model: this.model,
      },
    });
    $.export("$summary", `Successfully created moderation with ID ${response.id}`);
    return response;
  },
};
