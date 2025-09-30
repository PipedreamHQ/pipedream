import app from "../../kindo.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "kindo-chat",
  name: "Chat",
  description: "Creates a model response for the given chat conversation using Kindo's API. [See the documentation](https://app.kindo.ai/settings/api) for more information.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    model: {
      type: "string",
      label: "Model",
      description: "The model name from Kindo's available models",
    },
    messages: {
      type: "string[]",
      label: "Messages",
      description: "A list of messages comprising the conversation so far. Depending on the [model](https://app.kindo.ai/settings/api) you use, different message types (modalities) are supported, like [text](https://platform.openai.com/docs/guides/text-generation), [images](https://platform.openai.com/docs/guides/vision), and [audio](https://platform.openai.com/docs/guides/audio). [See the documentation](https://platform.openai.com/docs/api-reference/chat/create#chat-create-messages) for more information. Eg. `[{\"role\": \"user\", \"content\": \"Hello, world!\"}]",
    },
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "The maximum number of [tokens](https://beta.openai.com/tokenizer) to generate in the completion.",
      optional: true,
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "**Optional**. What [sampling temperature](https://towardsdatascience.com/how-to-sample-from-language-models-682bceb97277) to use. Higher values means the model will take more risks. Try `0.9` for more creative applications, and `0` (argmax sampling) for ones with a well-defined answer.",
      optional: true,
    },
    topP: {
      type: "string",
      label: "Top P",
      description: "An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So `0.1` means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or `temperature` but not both.",
      optional: true,
    },
    n: {
      type: "integer",
      label: "N",
      description: "How many completions to generate for each prompt",
      optional: true,
    },
    stop: {
      type: "string[]",
      label: "Stop",
      description: "Up to 4 sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence.",
      optional: true,
    },
    presencePenalty: {
      type: "string",
      label: "Presence Penalty",
      description: "Number between `-2.0` and `2.0`. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.",
      optional: true,
    },
    frequencyPenalty: {
      type: "string",
      label: "Frequency Penalty",
      description: "Number between `-2.0` and `2.0`. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.",
      optional: true,
    },
    additionalParameters: {
      type: "object",
      label: "Additional Parameters",
      description: "Additional parameters to pass to the API.",
      optional: true,
    },
  },
  methods: {
    chat(args = {}) {
      return this.app.post({
        path: "/chat/completions",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      chat,
      model,
      messages,
      maxTokens,
      temperature,
      topP,
      n,
      stop,
      presencePenalty,
      frequencyPenalty,
      additionalParameters,
    } = this;

    const response = await chat({
      $,
      data: {
        model,
        messages: utils.parseArray(messages),
        max_tokens: maxTokens,
        ...(temperature && {
          temperature: +temperature,
        }),
        ...(topP && {
          top_p: +topP,
        }),
        n,
        stop,
        ...(presencePenalty && {
          presence_penalty: +presencePenalty,
        }),
        ...(frequencyPenalty && {
          frequency_penalty: +frequencyPenalty,
        }),
        ...additionalParameters,
      },
    });
    $.export("$summary", "Successfully created model response");
    return response;
  },
};
