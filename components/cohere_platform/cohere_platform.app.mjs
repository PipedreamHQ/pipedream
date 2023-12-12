import cohere from "cohere-ai";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "cohere_platform",
  propDefinitions: {
    endSequences: {
      type: "string[]",
      label: "End Sequences",
      description: "The generated text will be cut at the beginning of the earliest occurence of an end sequence. The sequence will be excluded from the text.",
      optional: true,
    },
    frequencyPenalty: {
      type: "string",
      label: "Frequency Penalty",
      description: "Defaults to `0.0`, min value of `0.0`, max value of `1.0`. Can be used to reduce repetitiveness of generated tokens. Similar to `frequency_penalty`, except that this penalty is applied equally to all tokens that have already appeared, regardless of their exact frequencies.",
      optional: true,
    },
    k: {
      type: "integer",
      label: "K",
      description: "Defaults to `0`(disabled), which is the minimum. Maximum value is `500`. Ensures only the top `k` most likely tokens are considered for generation at each step.",
      min: 1,
      max: 500,
      optional: true,
    },
    logitBias: {
      type: "object",
      label: "Logit Bias",
      description: "Used to prevent the model from generating unwanted tokens or to incentivize it to include desired tokens. The format is `{token_id: bias}` where bias is a float between `-10` and `10`. Tokens can be obtained from text using [Tokenize](https://docs.cohere.ai/reference/tokenize). For example, if the value `{'11': -10}` is provided, the model will be very unlikely to include the token 11 (`\"\n\"`, the newline character) anywhere in the generated text. In contrast `{'11': 10}` will result in generations that nearly only contain that token. Values between -10 and 10 will proportionally affect the likelihood of the token appearing in the generated text. Note: logit bias may not be supported for all custom models.",
      optional: true,
    },
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "Denotes the number of tokens to predict per generation, defaults to 20. See [BPE Tokens](https://docs.cohere.ai/docs/tokens) for more details. Can only be set to `0` if `return_likelihoods` is set to `ALL` to get the likelihood of the prompt.",
      optional: true,
    },
    model: {
      type: "string",
      label: "Model",
      description: "The size of the model. Currently available models are `medium` and `xlarge` (default). Smaller models are faster, while larger models will perform better. [Custom models](https://docs.cohere.ai/docs/training-custom-models) can also be supplied with their full ID.",
      options: constants.MODEL_OPTIONS,
      optional: true,
    },
    numGenerations: {
      type: "integer",
      label: "Number of generations",
      description: "Defaults to 1, min value of 1, max value of 5. Denotes the maximum number of generations that will be returned.",
      min: 1,
      max: 5,
      optional: true,
    },
    p: {
      type: "string",
      label: "P",
      description: "Defaults to `0.75`. Set to `1.0` or `0` to disable. If set to a probability `0.0 < p < 1.0`, it ensures that only the most likely tokens, with total probability mass of `p`, are considered for generation at each step. If both `k` and `p` are enabled, `p` acts after `k`.",
      optional: true,
    },
    preset: {
      type: "string",
      label: "Preset",
      description: "The ID of a custom playground preset. You can create presets in the [playground](https://dashboard.cohere.ai/playground/generate). If you use a preset, all other parameters become optional, and any included parameters will override the preset's parameters.",
      optional: true,
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "Represents the prompt or text to be completed. Trailing whitespaces will be trimmed. If your use case requires trailing whitespaces, please contact ivan@cohere.ai.",
    },
    returnLikelihoods: {
      type: "string",
      label: "Return Likelihoods",
      description: "It specifies how and if the token likelihoods are returned with the response. Defaults to `NONE`. If `GENERATION` is selected, the token likelihoods will only be provided for generated text. If `ALL` is selected, the token likelihoods will be provided both for the prompt and the generated text.",
      options: constants.RETURN_LIKELIHOODS_OPTIONS,
      optional: true,
    },
    stopSequences: {
      type: "string[]",
      label: "Stop Sequences",
      description: "The generated text will be cut at the end of the earliest occurence of a stop sequence. The sequence will be included the text.",
      optional: true,
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "Defaults to `0.75`, min value of `0.0`, max value of `5.0`. A non-negative float that tunes the degree of randomness in generation. Lower temperatures mean less random generations. See [Temperature](https://docs.cohere.ai/docs/temperature) for more details.",
      optional: true,
    },
    truncate: {
      type: "string",
      label: "Truncate",
      description: "It specifies how the API will handle inputs longer than the maximum token length. Passing `START` will discard the start of the input. `END` will discard the end of the input. In both cases, input is discarded until the remaining input is exactly the maximum input token length for the model. If `NONE` is selected, when the input exceeds the maximum input token length an error will be returned.",
      options: constants.TRUNCATE_OPTIONS,
      optional: true,
    },
    classifyModel: {
      type: "string",
      label: "Model",
      description: "The size of the model.",
      options: constants.CLASSIFY_MODEL_OPTIONS,
      optional: true,
    },
    summaryLength: {
      type: "string",
      label: "Length",
      description: "Indicates the approximate length of the summary.",
      options: constants.SUMMARY_LENGTH_OPTIONS,
      optional: true,
    },
    summaryFormat: {
      type: "string",
      label: "Format",
      description: "Indicates the style in which the summary will be delivered - in a free form paragraph or in bullet points.",
      options: constants.SUMMARY_FORMAT_OPTIONS,
      optional: true,
    },
    summaryModel: {
      type: "string",
      label: "Model",
      description: "The ID of the model to generate the summary with. Smaller models are faster, while larger models will perform better.",
      options: constants.SUMMARY_MODEL_OPTIONS,
      optional: true,
    },
  },
  methods: {
    api() {
      cohere.init(this.$auth.api_key);
      return cohere;
    },
    generateText(data) {
      return this.api().generate(data);
    },
    classifyText(data) {
      return this.api().classify(data);
    },
    summarizeText(data) {
      return this.api().summarize(data);
    },
  },
};
