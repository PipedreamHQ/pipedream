import app from "../../metatext_ai_pre_build_ai_models_api.app.mjs";

export default {
  key: "metatext_ai_pre_build_ai_models_api-analyze-sentiment",
  name: "Analyze Sentiment",
  description: "Determine the sentiment of the given text (positive, negative, or neutral). [See the documentation](https://app.metatext.ai/models/sentiment-analysis/inference-api).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
  },
  methods: {
    analyzeSentiment(args = {}) {
      return this.app.post({
        path: "/sentiment-analysis",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.analyzeSentiment({
      step,
      data: {
        text: this.text,
      },
    });

    step.export("$summary", "Successfully analyzed sentiment.");

    return response;
  },
};
