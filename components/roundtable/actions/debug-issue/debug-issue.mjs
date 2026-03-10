import roundtable from "../../roundtable.app.mjs";

export default {
  key: "roundtable-debug-issue",
  name: "Debug Issue",
  description: "Debug an issue using multiple AI models analyzing the problem from different angles. [See the documentation](https://roundtable.now)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    roundtable,
    problem: {
      type: "string",
      label: "Problem",
      description: "Description of the bug or issue to debug",
    },
    error: {
      type: "string",
      label: "Error Message",
      description: "The error message or stack trace",
      optional: true,
    },
    expectedBehavior: {
      type: "string",
      label: "Expected Behavior",
      description: "What should happen instead",
      optional: true,
    },
    code: {
      type: "string",
      label: "Code",
      description: "Relevant code snippet",
      optional: true,
    },
    thinkingLevel: {
      propDefinition: [roundtable, "thinkingLevel"],
    },
  },
  async run({ $ }) {
    const response = await this.roundtable.debug({
      $,
      data: {
        problem: this.problem,
        error: this.error,
        expected_behavior: this.expectedBehavior,
        code: this.code,
        thinking_level: this.thinkingLevel,
      },
    });
    $.export("$summary", "Debugging completed");
    return response;
  },
};
