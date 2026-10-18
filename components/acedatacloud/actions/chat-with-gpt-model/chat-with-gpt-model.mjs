import acedatacloud from "../../acedatacloud.app.mjs";
import { requiredText } from "../../common/utils.mjs";
import { chatCompletionError } from "../../common/chat.mjs";

export default {
  key: "acedatacloud-chat-with-gpt-model",
  name: "Chat With GPT Model",
  description: "Send a text prompt to a selected GPT model through Ace Data Cloud and return the completion with usage. [See the documentation](https://platform.acedata.cloud/documents/openai-chat-completions)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    acedatacloud,
    model: {
      propDefinition: [
        acedatacloud,
        "chatModel",
      ],
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "Text to send to the model, e.g. `Summarize this release note in one sentence.`.",
    },
    systemPrompt: {
      type: "string",
      label: "System Prompt",
      description: "Optional instruction, e.g. `Answer concisely in English.`. Check support for the selected model.",
      optional: true,
    },
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "Optional output token limit, e.g. `128`. Model limits and metered usage still apply.",
      min: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    const model = requiredText(this.model, "Model");
    const prompt = requiredText(this.prompt, "Prompt");
    if (this.maxTokens !== undefined && (!Number.isInteger(this.maxTokens) || this.maxTokens < 1)) {
      throw new Error("Max Tokens must be a positive integer.");
    }
    const models = await this.acedatacloud.listChatModels({
      $,
    });
    if (!models.some((entry) => entry.id === model)) {
      throw new Error("Model is not in the current published GPT chat catalog. Refresh the Model options; no alternate model was requested.");
    }
    const messages = [
      ...(this.systemPrompt
        ? [
          {
            role: "system",
            content: requiredText(this.systemPrompt, "System Prompt"),
          },
        ]
        : []),
      {
        role: "user",
        content: prompt,
      },
    ];
    let response;
    try {
      response = await this.acedatacloud.request({
        $,
        path: "/openai/chat/completions",
        data: {
          model,
          messages,
          stream: false,
          ...(this.maxTokens !== undefined && {
            max_tokens: this.maxTokens,
          }),
        },
      });
    } catch (error) {
      throw chatCompletionError(error);
    }
    if (!Array.isArray(response?.choices) || !response.choices.length) {
      throw new Error("Chat request returned no completion choices. Inspect request history before retrying; this action did not send another request.");
    }
    $.export("$summary", `Received a chat completion from ${model}`);
    return response;
  },
};
