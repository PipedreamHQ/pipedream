import app from "../../stealthgpt.app.mjs";

export default {
  key: "stealthgpt-generate-content",
  name: "Generate or Rephrase Content",
  description: "Generates or rephrases content based on the provided prompt. [See the documentation](https://docs.stealthgpt.ai/api-requests-and-parameters)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    prompt: {
      propDefinition: [
        app,
        "prompt",
      ],
    },
    rephrase: {
      type: "boolean",
      label: "Rephrase",
      description: "A boolean value (`true` or `false`) that indicates whether the API should rephrase the content or generate new content based on the prompt. Set to `true` for rephrasing and `false` for content generation.",
    },
    tone: {
      type: "string",
      label: "Tone",
      description: "Specifies the desired tone for the response. For example, `Casual`, `Academic`, etc.",
      optional: true,
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "Indicates the detail level of the response: `High`, `Medium`, or `Low`.",
      optional: true,
      options: [
        "High",
        "Medium",
        "Low",
      ],
    },
    business: {
      type: "boolean",
      label: "Business",
      description: "A boolean flag to indicate if the request is related to a business context. Setting this to `true` uses a model 10x more powerful than the standard StealthGPT engine, making the content far more undetectable and coherent but also consuming more tokens.",
      optional: true,
    },
  },
  methods: {
    generateContent(args = {}) {
      return this.app.post({
        path: "/stealthify",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      generateContent,
      prompt,
      rephrase,
      tone,
      mode,
      business,
    } = this;

    const response = await generateContent({
      $,
      data: {
        prompt,
        rephrase,
        tone,
        mode,
        business,
      },
    });

    $.export("$summary", "Successfully generated content.");
    return response;
  },
};
