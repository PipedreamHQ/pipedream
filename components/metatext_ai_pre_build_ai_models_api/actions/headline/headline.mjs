import app from "../../metatext_ai_pre_build_ai_models_api.app.mjs";

export default {
  key: "metatext_ai_pre_build_ai_models_api-headline",
  name: "Generate Headline",
  description: "Generate a short summary for news headlines. [See the documentation](https://app.metatext.ai/models/headline/inference-api).",
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
    headline(args = {}) {
      return this.app.post({
        path: "/headline",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.headline({
      step,
      data: {
        text: this.text,
      },
    });

    step.export("$summary", "Successfully generated headline.");

    return response;
  },
};
