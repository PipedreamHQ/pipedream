import app from "../../google_palm_api.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "google_palm_api-chat",
  name: "Chat",
  description: "Chat using Google PaLM. [See the docs here](https://developers.generativeai.google/api/python/google/generativeai/chat)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    promptText: {
      type: "string",
      label: "Prompt Text",
      description: "The text to be used as a prompt for the chat",
    },
    previousMessages: {
      type: "string[]",
      label: "Previous Messages",
      description: "The previous messages in the chat. If provided, will override the chat history",
      optional: true,
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: `The temperature to use for the chat. Values can range from [0.0,1.0], inclusive.
        A value closer to 1.0 will produce responses that are more varied and creative, while a value closer to 0.0 will typically result in more straightforward responses from the model.
        Defaults to \`0.5\``,
      optional: true,
    },
    context: {
      type: "string",
      label: "Context",
      description: "Text that should be provided to the model first, to ground the response",
      optional: true,
    },
    candidateCount: {
      type: "integer",
      label: "Candidate Count",
      description: "The maximum number of generated response messages to return. This value must be between [1, 8], inclusive. If unset, this will default to 1. Note: Only unique candidates are returned. Higher temperatures are more likely to produce unique candidates. Setting temperature=0.0 will always return 1 candidate regardless of the candidate_count.",
      optional: true,
      default: 1,
      min: 1,
      max: 8,
    },
    topK: {
      type: "string",
      label: "Top K",
      description: "The API uses combined nucleus and top-k sampling. top_k sets the maximum number of tokens to sample from on each step.",
      optional: true,
    },
    topP: {
      type: "string",
      label: "Top P",
      description: "  The API uses combined nucleus and top-k sampling. top_p configures the nucleus sampling. It sets the maximum cumulative probability of tokens to sample from. For example, if the sorted probabilities are [0.5, 0.2, 0.1, 0.1, 0.05, 0.05] a top_p of 0.8 will sample as [0.625, 0.25, 0.125, 0, 0, 0]. Typical values are in the [0.9, 1.0] range.",
      optional: true,
    },
    maxOutputTokens: {
      type: "integer",
      label: "Max Output Tokens",
      description: "Maximum number of tokens to include in a candidate. Must be greater than zero. If unset, will default to 64.",
      optional: true,
    },
    stopSequences: {
      type: "string",
      label: "Stop Sequences",
      description: "A set of up to 5 character sequences that will stop output generation. If specified, the API will stop at the first appearance of a stop sequence. The stop sequence will not be included as part of the response.",
      optional: true,
    },
    harmCategories: {
      type: "string[]",
      label: "Harm Categories",
      description: "To set safety settings, select the harm categories to set a threshold for",
      optional: true,
      options() {
        return constants.HARM_CATEGORIES.map(({
          value, label,
        }) => ({
          value,
          label,
        }));
      },
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.harmCategories?.length) {
      return props;
    }
    for (const category of this.harmCategories) {
      props[`${category}_threshold`] = {
        type: "string",
        label: `${category} - Harm Block Threshold`,
        description: `Select the harm block threshold to set for the category ${category}`,
        options: this.getThresholdOptions(),
      };
    }
    return props;
  },
  methods: {
    getThresholdOptions() {
      return constants.HARM_BLOCK_THRESHOLD.map(({
        value, label,
      }) => ({
        value,
        label,
      }));
    },
    async chat({
      promptText,
      previousMessages,
      temperature,
      context,
      candidateCount,
      topK,
      topP,
      maxOutputTokens,
      stopSequences,
      safetySettings,
    }) {
      return this.app.chat({
        temperature,
        prompt: {
          context,
          messages: [
            ...previousMessages.map((message) => ({
              content: message,
            })),
            {
              content: promptText,
            },
          ],
        },
        candidate_count: candidateCount,
        top_k: topK
          ? +topK
          : undefined,
        top_p: topP
          ? +topP
          : undefined,
        max_output_tokens: maxOutputTokens,
        stop_sequences: stopSequences,
        safety_settings: safetySettings,
      });
    },
  },
  async run({ $ }) {
    const safetySettings = [];
    if (this.harmCategories?.length) {
      for (const category of this.harmCategories) {
        const threshold = constants.HARM_BLOCK_THRESHOLD.find(({ value }) => value === this[`${category}_threshold`]);
        safetySettings.push({
          category: (constants.HARM_CATEGORIES.find(({ value }) => value === category)).numValue,
          threshold: threshold?.numValue,
        });
      }
    }

    const response = await this.chat({
      promptText: this.promptText,
      previousMessages: this.previousMessages || [],
      temperature: parseFloat(this.temperature || "0.5"),
      context: this.context,
      candidteaCount: this.candidateCount,
      topK: this.topK,
      topP: this.topP,
      maxOutputTokens: this.maxOutputTokens,
      stopSequences: this.stopSequences,
      safetySettings,
    });
    $.export("$summary", "Successfully received response from Google PaLM");
    return response;
  },
};
