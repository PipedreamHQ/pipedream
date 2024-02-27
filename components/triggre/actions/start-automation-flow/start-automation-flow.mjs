import triggre from "../../triggre.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "triggre-start-automation-flow",
  name: "Start Automation Flow",
  description: "Starts an automation flow within your Triggre application. [See the documentation](https://docs.triggre.com/lessons/making-business-critical-connections-queues)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    triggre,
    listenTo: {
      propDefinition: [
        triggre,
        "listenTo",
      ],
    },
    flowName: {
      propDefinition: [
        triggre,
        "flowName",
      ],
    },
    flowData: {
      propDefinition: [
        triggre,
        "flowData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.triggre.startAutomationFlow(this.flowName, this.flowData);
    $.export("$summary", `Successfully started automation flow ${this.flowName}`);
    return response;
  },
};
