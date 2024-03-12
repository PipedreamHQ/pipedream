import flowiseai from "../../flowiseai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "flowiseai-make-prediction",
  name: "Make Prediction",
  description: "Calculates an output based on your created flow in Flowise. [See the documentation](https://docs.flowiseai.com/configuration)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    flowiseai,
    flow: {
      propDefinition: [
        flowiseai,
        "flow",
      ],
    },
    variables: {
      propDefinition: [
        flowiseai,
        "variables",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.flowiseai.calculateOutput({
      flowId: this.flow,
      variables: this.variables,
    });

    $.export("$summary", `Output calculated for flow ID ${this.flow}`);
    return response;
  },
};
