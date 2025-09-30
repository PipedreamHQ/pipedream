import triggre from "../../triggre.app.mjs";

export default {
  key: "triggre-start-automation-flow",
  name: "Start Automation Flow",
  description: "Starts an automation flow within your Triggre application. [See the documentation](https://docs.triggre.com/lessons/how-to-create-an-incoming-web-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    triggre,
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
    const response = await this.triggre.startAutomationFlow({
      $,
      flowName: encodeURI(this.flowName),
      flowNameWithUnderscores: this.flowName.replace(/ /g, "_"),
      data: this.flowData,
    });
    $.export("$summary", `Successfully started automation flow ${this.flowName}`);
    return response;
  },
};
