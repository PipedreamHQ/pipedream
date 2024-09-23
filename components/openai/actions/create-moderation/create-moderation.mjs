import openai from "../../openai.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "openai-create-moderation",
  name: "Create Moderation",
  description: "Classifies if text is potentially harmful. [See the documentation](https://platform.openai.com/docs/api-reference/moderations/create)",
  version: "0.0.4",
  type: "action",
  props: {
    openai,
    input: {
      type: "string",
      label: "Input",
      description: "The input text to classify",
    },
    model: {
      type: "string",
      label: "Model",
      description: "The model to use",
      options: constants.MODERATION_MODELS,
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
