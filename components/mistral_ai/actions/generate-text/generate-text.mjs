import mistralAI from "../../mistral_ai.app.mjs";

export default {
  key: "mistral_ai-generate-text",
  name: "Generate Text",
  description: "Generate text using Mistral AI models. [See the Documentation](https://docs.mistral.ai/api/#tag/chat/operation/chat_completion_v1_chat_completions_post)",
  version: "0.0.1",
  type: "action",
  props: {
    mistralAI,
    message: {
      type: "string",
      label: "Message",
      description: "The prompt message to send",
    },
    modelId: {
      propDefinition: [
        mistralAI,
        "modelId",
      ],
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "The sampling temperature to use, we recommend between 0.0 and 0.7. Higher values like 0.7 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. We generally recommend altering this or top_p but not both. The default value varies depending on the model you are targeting.",
      optional: true,
    },
    topP: {
      type: "string",
      label: "Top P",
      description: "Nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both.",
      optional: true,
    },
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "The maximum number of tokens to generate in the completion. The token count of your prompt plus max_tokens cannot exceed the model's context length.",
      optional: true,
    },
    randomSeed: {
      type: "integer",
      label: "Random Seed",
      description: "The seed to use for random sampling. If set, different calls will generate deterministic results.",
      optional: true,
    },
    n: {
      type: "integer",
      label: "N",
      description: "Number of completions to return for each request, input tokens are only billed once.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mistralAI.sendPrompt({
      $,
      data: {
        model: this.modelId,
        messages: [
          {
            content: this.message,
            role: "user",
          },
        ],
        temperature: this.temperature && +this.temperature,
        top_p: this.topP && +this.topP,
        max_tokens: this.maxTokens,
        random_seed: this.randomSeed,
        n: this.n,
      },
    });
    if (response?.id) {
      $.export("$summary", `Successfully retrieved response with ID: ${response.id}`);
    }
    return response;
  },
};
