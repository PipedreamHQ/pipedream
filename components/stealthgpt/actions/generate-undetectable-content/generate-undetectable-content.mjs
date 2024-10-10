import app from "../../stealthgpt.app.mjs";

export default {
  key: "stealthgpt-generate-undetectable-content",
  name: "Generate Undetectable Content",
  description: "Generates full, undetectable blog articles with relevant images in markdown.",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    prompt: {
      description: "The input text or question for which you want the StealthGPT to generate content.",
      propDefinition: [
        app,
        "prompt",
      ],
    },
    withImages: {
      type: "boolean",
      label: "With Images",
      description: "A boolean value indicating whether to include images in the generated content. Default is `true`.",
      optional: true,
    },
    size: {
      type: "string",
      label: "Size",
      description: "The desired length of the generated article. Can be `small`, `medium`, or `long`. Default is `small`.",
      optional: true,
      options: [
        "small",
        "medium",
        "long",
      ],
    },
  },
  methods: {
    generateUndetectableContent(args = {}) {
      return this.app.post({
        path: "/stealthify/articles",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      generateUndetectableContent,
      prompt,
      size,
      withImages,
    } = this;

    const response = await generateUndetectableContent({
      $,
      data: {
        prompt,
        size,
        withImages,
      },
    });

    $.export("$summary", "Successfully generated undetectable content.");
    return response;
  },
};
