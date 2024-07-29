import openai from "../../openai.app.mjs";
import common from "../common/common.mjs";

export default {
  ...common,
  name: "Create Completion (Send Prompt)",
  version: "0.1.9",
  key: "openai-send-prompt",
  description: "OpenAI recommends using the **Chat** action for the latest `gpt-3.5-turbo` API, since it's faster and 10x cheaper. This action creates a completion for the provided prompt and parameters using the older `/completions` API. [See the documentation](https://beta.openai.com/docs/api-reference/completions/create)",
  type: "action",
  props: {
    openai,
    alert: {
      type: "alert",
      alertType: "warning",
      content: "We recommend using the Pipedream **Chat** action instead of this one. It supports the latest `gpt-3.5-turbo` API, which is faster and 10x cheaper. This action, **Create Completion (Send Prompt)**, creates a completion for the provided prompt and parameters using the older `/completions` API.",
    },
    modelId: {
      propDefinition: [
        openai,
        "completionModelId",
      ],
    },
    prompt: {
      label: "Prompt",
      description: "The prompt to generate completions for",
      type: "string",
    },
    suffix: {
      label: "Suffix",
      description: "The suffix that comes after a completion of inserted text",
      type: "string",
      optional: true,
    },
    ...common.props,
    bestOf: {
      label: "Best Of",
      description: "Generates best_of completions server-side and returns the \"best\" (the one with the highest log probability per token). If set, results cannot be streamed.",
      type: "integer",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.openai.createCompletion({
      $,
      data: this._getCommonArgs(),
    });

    if (response) {
      $.export("$summary", `Successfully sent prompt with id ${response.id}`);
    }

    return response;
  },
};
