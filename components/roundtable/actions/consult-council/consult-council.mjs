import roundtable from "../../roundtable.app.mjs";

export default {
  key: "roundtable-consult-council",
  name: "Consult Council",
  description: "Run a multi-model AI debate on any question. Multiple AI models discuss your prompt, then a moderator synthesizes all perspectives. [See the documentation](https://roundtable.now)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    roundtable,
    prompt: {
      propDefinition: [roundtable, "prompt"],
    },
    thinkingLevel: {
      propDefinition: [roundtable, "thinkingLevel"],
    },
    mode: {
      propDefinition: [roundtable, "mode"],
    },
    context: {
      type: "string",
      label: "Context",
      description: "Additional context for the discussion",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.roundtable.consult({
      $,
      data: {
        prompt: this.prompt,
        thinking_level: this.thinkingLevel,
        mode: this.mode,
        context: this.context,
      },
    });
    $.export("$summary", "Council discussion completed");
    return response;
  },
};
