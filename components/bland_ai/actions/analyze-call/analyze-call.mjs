import blandAi from "../../bland_ai.app.mjs";

export default {
  key: "bland_ai-analyze-call",
  name: "Analyze Call",
  description: "Analyzes an input call, extracting structured data and providing insights. [See the documentation](https://docs.bland.ai/api-v1/post/calls-id-analyze)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    blandAi,
    callId: {
      propDefinition: [
        blandAi,
        "callId",
      ],
    },
    goal: {
      propDefinition: [
        blandAi,
        "goal",
      ],
    },
    questions: {
      propDefinition: [
        blandAi,
        "questions",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.blandAi.analyzeCall({
      $,
      callId: this.callId,
      data: {
        goal: this.goal,
        questions: this.questions?.map?.((str) => typeof str === "string"
          ? JSON.parse(str)
          : str),
      },
    });
    $.export("$summary", "Call analyzed successfully");
    return response;
  },
};
