import roundtable from "../../roundtable.app.mjs";

export default {
  key: "roundtable-review-code",
  name: "Review Code",
  description: "Get a multi-perspective code review from multiple AI models. [See the documentation](https://roundtable.now)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    roundtable,
    code: {
      type: "string",
      label: "Code",
      description: "The code to review",
    },
    language: {
      type: "string",
      label: "Language",
      description: "Programming language",
      optional: true,
    },
    focus: {
      type: "string[]",
      label: "Focus Areas",
      description: "Specific areas to focus on (e.g., security, performance)",
      optional: true,
    },
    thinkingLevel: {
      propDefinition: [roundtable, "thinkingLevel"],
    },
  },
  async run({ $ }) {
    const response = await this.roundtable.reviewCode({
      $,
      data: {
        code: this.code,
        language: this.language,
        focus: this.focus,
        thinking_level: this.thinkingLevel,
      },
    });
    $.export("$summary", "Code review completed");
    return response;
  },
};
