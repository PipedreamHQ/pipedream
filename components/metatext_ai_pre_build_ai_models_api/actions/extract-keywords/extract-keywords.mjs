import app from "../../metatext_ai_pre_build_ai_models_api.app.mjs";

export default {
  key: "metatext_ai_pre_build_ai_models_api-extract-keywords",
  name: "Extract Keywords",
  description: "Identify and extract significant keywords from the given text. [See the documentation](https://app.metatext.ai/models/keyword-extractor/inference-api).",
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
    extractKeywords(args = {}) {
      return this.app.post({
        path: "/keyword-extractor",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.extractKeywords({
      step,
      data: {
        text: this.text,
      },
    });

    step.export("$summary", "Successfully extracted keywords.");

    return response;
  },
};
