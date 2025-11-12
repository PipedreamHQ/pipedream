import cerebras from "../../cerebras.app.mjs";

export default {
  name: "Create Chat Completion",
  key: "cerebras-create-chat-completion",
  description: "Create a chat completion with Cerebras AI. [See the documentation](https://inference-docs.cerebras.ai/api-reference/chat-completions)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cerebras,
    model: {
      propDefinition: [
        cerebras,
        "model",
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to send to the model",
    },
    maxCompletionTokens: {
      type: "integer",
      label: "Max Completion Tokens",
      description: "The maximum number of tokens that can be generated in the completion. The total length of input tokens and generated tokens is limited by the model's context length.",
      optional: true,
    },
    stream: {
      propDefinition: [
        cerebras,
        "stream",
      ],
    },
    seed: {
      propDefinition: [
        cerebras,
        "seed",
      ],
    },
    stop: {
      propDefinition: [
        cerebras,
        "stop",
      ],
    },
    temperature: {
      propDefinition: [
        cerebras,
        "temperature",
      ],
    },
    topP: {
      propDefinition: [
        cerebras,
        "topP",
      ],
    },
    toolChoice: {
      type: "string",
      label: "Tool Choice",
      description: "Controls which (if any) tool is called by the model",
      optional: true,
      options: [
        "none",
        "auto",
        "required",
      ],
    },
    tools: {
      type: "object",
      label: "Tools",
      description: "A list of tools the model may call. [See the documentation](https://inference-docs.cerebras.ai/api-reference/chat-completions#tool-choice) for more information",
      optional: true,
    },
    user: {
      propDefinition: [
        cerebras,
        "user",
      ],
    },
    logprobs: {
      type: "boolean",
      label: "Log Probabilities",
      description: "Whether to return log probabilities of the output tokens or not",
      optional: true,
      default: false,
    },
    topLogprobs: {
      type: "integer",
      label: "Top Log Probabilities",
      description: "An integer between 0 and 20 specifying the number of most likely tokens to return at each token position, each with an associated log probability",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      model,
      message,
      maxCompletionTokens,
      stream,
      seed,
      stop,
      temperature,
      topP,
      toolChoice,
      tools,
      user,
      logprobs,
      topLogprobs,
    } = this;

    const response = await this.cerebras.chatCompletion({
      $,
      data: {
        model,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        max_completion_tokens: maxCompletionTokens,
        stream,
        seed,
        stop,
        temperature,
        top_p: topP,
        tool_choice: toolChoice,
        tools,
        user,
        logprobs,
        top_logprobs: topLogprobs,
      },
    });

    $.export("$summary", "Successfully created chat completion");
    return response;
  },
};
