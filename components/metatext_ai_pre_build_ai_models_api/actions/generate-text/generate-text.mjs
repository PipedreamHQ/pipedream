import app from "../../metatext_ai_pre_build_ai_models_api.app.mjs";

export default {
  key: "metatext_ai_pre_build_ai_models_api-generate-text",
  name: "Generate Text",
  description: "Generate text based on the given prompt. [See the documentation](https://app.metatext.ai/models/text-generator/inference-api).",
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
    generateText(args = {}) {
      return this.app.post({
        path: "/text-generator",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.generateText({
      step,
      data: {
        text: this.text,
      },
    });

    step.export("$summary", "Successfully generated text.");

    return response;
  },
};
