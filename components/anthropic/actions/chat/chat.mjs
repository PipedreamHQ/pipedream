import anthropic from "../../anthropic.app.mjs";

// Claude Opus 4.7 and later, and every Claude 5 model, return a 400 error for
// `temperature`, `top_p` and `top_k`: https://platform.claude.com/docs/en/models/sonnet-5-5/overview
const MODELS_WITHOUT_SAMPLING = /^claude-(fable|mythos|(opus|sonnet|haiku)-([5-9]|\d{2,})|opus-4-[7-9])/;

export default {
  name: "Chat",
  version: "0.2.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "anthropic-chat",
  description: "The Chat API. [See the documentation](https://docs.anthropic.com/claude/reference/messages_post)",
  type: "action",
  props: {
    anthropic,
    model: {
      propDefinition: [
        anthropic,
        "model",
      ],
    },
    userMessage: {
      label: "User Message",
      type: "string",
      description: "The user messages provide instructions to the assistant",
    },
    messages: {
      label: "Prior Message History",
      type: "string[]",
      description: "All relevant information must be supplied via the conversation. You can provide an array of messages from prior conversations here always beginning with the human message.",
      optional: true,
    },
    temperature: {
      label: "Temperature",
      description: "**Optional**. Amount of randomness injected into the response. Ranges from 0 to 1, e.g. `0.7`. Use temp closer to 0 for analytical / multiple choice, and temp closer to 1 for creative and generative tasks. Not sent to models that don't accept it: Claude Opus 4.7 and later, and the Claude 5 models such as `claude-sonnet-5-5`.",
      type: "string",
      optional: true,
    },
    topK: {
      label: "Top K",
      description: "Only sample from the top K options for each subsequent token. Used to remove `long tail` low probability responses, e.g. `40`. Not sent to models that don't accept it: Claude Opus 4.7 and later, and the Claude 5 models such as `claude-sonnet-5-5`.",
      type: "integer",
      optional: true,
    },
    topP: {
      label: "Top P",
      description: "Does nucleus sampling, in which we compute the cumulative distribution over all the options for each subsequent token in decreasing probability order and cut it off once it reaches a particular probability specified, e.g. `0.9`. Not sent to models that don't accept it: Claude Opus 4.7 and later, and the Claude 5 models such as `claude-sonnet-5-5`.",
      type: "string",
      optional: true,
    },
    maxTokensToSample: {
      label: "Maximum Tokens To Sample",
      description: "A maximum number of tokens to generate before stopping.",
      type: "integer",
    },
  },
  async run({ $ }) {
    const messages = [];

    const priorMessages = typeof this.messages === "string"
      ? JSON.parse(this.messages)
      : this.messages;

    if (priorMessages?.length) {
      let isUserMessage = true;

      for (const message of priorMessages) {
        messages.push({
          role: isUserMessage
            ? "user"
            : "assistant",
          content: message,
        });

        isUserMessage = !isUserMessage;
      }
    }

    messages.push({
      role: "user",
      content: this.userMessage,
    });

    const sendSampling = !MODELS_WITHOUT_SAMPLING.test(this.model);

    const response = await this.anthropic.createMessage({
      $,
      data: {
        messages,
        model: this.model,
        max_tokens: this.maxTokensToSample,
        temperature: sendSampling && this.temperature
          ? parseFloat(this.temperature)
          : undefined,
        top_p: sendSampling && this.topP
          ? parseFloat(this.topP)
          : undefined,
        top_k: sendSampling
          ? this.topK
          : undefined,
      },
    });

    if (response) {
      const samplingSkipped = !sendSampling
        && (this.temperature || this.topP || Number.isInteger(this.topK));
      $.export("$summary", `Successfully sent message with ID ${response.id}${samplingSkipped
        ? `. Temperature, Top K and Top P were not sent: ${this.model} does not accept them`
        : ""}`);
    }

    const originalMessages = messages.map(({ content }) => content);
    return {
      original_messages: originalMessages,
      original_messages_with_assistant_response: originalMessages.concat(response.content[0].text),
      ...response,
    };
  },
};
