import blandAi from "../../bland_ai.app.mjs";

export default {
  key: "bland-ai-analyze-call",
  name: "Analyze Call",
  description: "Analyzes an input call, extracting structured data and providing insights.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    blandAi,
    callRecordOrStream: {
      propDefinition: [
        blandAi,
        "callRecordOrStream",
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
      data: {
        callRecordOrStream: this.callRecordOrStream,
        goal: this.goal,
        questions: this.questions,
      },
    });
    $.export("$summary", "Call analyzed successfully");
    return response;
  },
};
