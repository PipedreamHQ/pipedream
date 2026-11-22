import acedatacloud from "../../acedatacloud.app.mjs";
import { requiredText } from "../../common/utils.mjs";
import {
  chatCompletionError, chatEndpoint, chatRequestData, confirmedChatResponse,
} from "../../common/chat.mjs";

export default {
  key: "acedatacloud-chat-with-gpt-model",
  name: "Chat With Model",
  description: "Send a text prompt to a published chat model through Ace Data Cloud using its native protocol and return the response with usage. [See the documentation](https://platform.acedata.cloud/models)",
  version: "0.0.3",
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
      propDefinition: [
        acedatacloud,
        "prompt",
      ],
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
      description: "Optional output token budget, e.g. `128`. Messages uses 4096 if omitted. This is a request budget, not the model's maximum capacity.",
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
    const selectedModel = models.find((entry) => entry.id === model);
    if (!selectedModel) {
      throw new Error("Model is not in the current published chat catalog. Refresh the Model options; no alternate model was requested.");
    }
    const endpoint = chatEndpoint(selectedModel);
    const data = chatRequestData({
      protocol: endpoint.protocol,
      model,
      prompt,
      systemPrompt: this.systemPrompt
        ? requiredText(this.systemPrompt, "System Prompt")
        : undefined,
      maxTokens: this.maxTokens,
    });
    let response;
    try {
      response = await this.acedatacloud.request({
        $,
        path: endpoint.path,
        data,
      });
    } catch (error) {
      throw chatCompletionError(error);
    }
    if (!confirmedChatResponse(response, endpoint.protocol)) {
      throw new Error("Chat request returned no confirmed native response. Inspect request history before retrying; this action did not send another request.");
    }
    $.export("$summary", `Received a chat completion from ${model}`);
    return response;
  },
};
