import app from "../../easy_peasy_ai.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "easy_peasy_ai-generate-text",
  name: "Generate Text",
  description: "Generates text outputs for the templates. [See the documentation](https://easy-peasy.ai/presets)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    preset: {
      type: "string",
      label: "Template",
      description: "The template name to use for generating content.",
      options: constants.TEMPLATES,
    },
    keywords: {
      type: "string",
      label: "Keywords",
      description: "Keywords to use for generating content. Eg. `Write an email to potential investors about my startup`. (maxlength: 1000)",
    },
    tone: {
      type: "string",
      label: "Tone",
      description: "The tone of the generated content. Eg. `friendly, funny, cheerful`.",
      optional: true,
    },
    extra1: {
      type: "string",
      label: "Extra 1",
      description: "Background Information (maxlength: 1000). Eg. `I am a software engineer`.",
      optional: true,
    },
    extra2: {
      type: "string",
      label: "Extra 2",
      description: "Background Information (maxlength: 1000). Eg. `I am starting a new business`.",
      optional: true,
    },
    extra3: {
      type: "string",
      label: "Extra 3",
      description: "Background Information (maxlength: 1000). Eg. `I am a student`.",
      optional: true,
    },
    outputs: {
      type: "integer",
      label: "Outputs",
      description: "The number of outputs to generate. Eg. `1`.",
      optional: true,
    },
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
    shouldUseGPT4: {
      type: "boolean",
      label: "Use GPT-4",
      description: "Use advanced AI model? Use the GPT-4 model for generating content.",
      optional: true,
    },
  },
  methods: {
    generateText(args = {}) {
      return this.app.post({
        path: "/generate",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      generateText,
      preset,
      keywords,
      tone,
      extra1,
      extra2,
      extra3,
      outputs,
      language,
      shouldUseGPT4,
    } = this;

    const response = await generateText({
      $,
      data: {
        preset,
        keywords,
        tone,
        extra1,
        extra2,
        extra3,
        outputs,
        language,
        shouldUseGPT4,
      },
    });
    $.export("$summary", "Successfully generated text content.");
    return response;
  },
};
