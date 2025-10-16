import app from "../../metatext_ai_pre_build_ai_models_api.app.mjs";

export default {
  key: "metatext_ai_pre_build_ai_models_api-spam-or-not",
  name: "Spam Or Not",
  description: "Determine whether the given text is spam or not. [See the documentation](https://app.metatext.ai/models/spam-or-not/inference-api).",
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
    spamOrNot(args = {}) {
      return this.app.post({
        path: "/spam-or-not",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.spamOrNot({
      step,
      data: {
        text: this.text,
      },
    });

    step.export("$summary", "Successfully determined whether the given text is spam or not.");

    return response;
  },
};
