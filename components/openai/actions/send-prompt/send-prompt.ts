import openai from "../../app/openai.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Send Prompt (Completion)",
  version: "0.1.0",
  key: "openai-send-prompt",
  description: "Creates a completion for the provided prompt and parameters. Use the **Chat** action for the ChatGPT API. [See Completion API docs here](https://platform.openai.com/docs/api-reference/completions)",
  type: "action",
  props: {
    openai,
    modelId: {
      propDefinition: [
        openai,
        "modelId",
      ],
    },
    prompt: {
      label: "Prompt",
      description: "The prompt(s) to generate completions for, encoded as a string, array of strings, array of tokens, or array of token arrays. Note that <|endoftext|> is the document separator that the model sees during training, so if a prompt is not specified the model will generate as if from the beginning of a new document.",
      type: "string",
      optional: true,
    },
    suffix: {
      label: "Suffix",
      description: "The suffix that comes after a completion of inserted text.",
      type: "string",
      optional: true,
    },
    maxTokens: {
      label: "Max Tokens",
      description: "The maximum number of [tokens](https://beta.openai.com/tokenizer) to generate in the completion.",
      type: "integer",
      optional: true,
    },
    temperature: {
      label: "Temperature",
      description: "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. We generally recommend altering this or **Top P**, but not both.",
      type: "string",
      optional: true,
    },
    topP: {
      label: "Top P",
      description: "An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or `temperature` but not both.",
      type: "string",
      optional: true,
    },
    n: {
      label: "N",
      description: "How many completions to generate for each prompt. **Note**: Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for `max_tokens` and `stop`",
      type: "integer",
      optional: true,
    },
    stream: {
      label: "Stream Partial Progress?",
      description: "Whether to stream back partial progress. If set, tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a `data: [DONE]`` message.",
      type: "boolean",
      optional: true,
      default: false,
    },
    stop: {
      label: "Stop",
      description: "Up to 4 sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence.",
      type: "string[]",
      optional: true,
    },
    presencePenalty: {
      label: "Presence Penalty",
      description: "Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.",
      type: "string",
      optional: true,
    },
    frequencyPenalty: {
      label: "Frequency Penalty",
      description: "Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.",
      type: "string",
      optional: true,
    },
    bestOf: {
      label: "Best Of",
      description: "Generates best_of completions server-side and returns the \"best\" (the one with the highest log probability per token). Results cannot be streamed.",
      type: "integer",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.openai.sendPrompt({
      model: this.modelId,
      prompt: this.prompt,
      max_tokens: this.maxTokens,
      temperature: this.temperature
        ? +this.temperature
        : this.temperature,
      top_p: this.topP
        ? +this.topP
        : this.topP,
      n: this.n,
      stop: this.stop,
      presence_penalty: this.presencePenalty
        ? +this.presencePenalty
        : this.presencePenalty,
      frequency_penalty: this.frequencyPenalty
        ? +this.frequencyPenalty
        : this.frequencyPenalty,
      best_of: this.bestOf,
    });

    if (response) {
      $.export("$summary", `Successfully sent prompt with id ${response.id}`);
    }

    return response;
  },
});
