import flowiseai from "../../flowiseai.app.mjs";

export default {
  key: "flowiseai-make-prediction",
  name: "Make Prediction",
  description: "Calculates an output based on your created flow in Flowise. [See the documentation](https://docs.flowiseai.com/using-flowise/api#prediction-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    flowiseai,
    flowId: {
      propDefinition: [
        flowiseai,
        "flowId",
      ],
    },
    question: {
      propDefinition: [
        flowiseai,
        "question",
      ],
    },
    history: {
      propDefinition: [
        flowiseai,
        "history",
      ],
    },
  },
  async run({ $ }) {
    const history = typeof this.history === "string"
      ? JSON.parse(this.history)
      : this.history;

    const response = await this.flowiseai.makePrediction({
      $,
      flowId: this.flowId,
      data: {
        question: this.question,
        history,
      },
    });

    $.export("$summary", `Prediction calculated for flow ID ${this.flowId}`);

    return response;
  },
};
