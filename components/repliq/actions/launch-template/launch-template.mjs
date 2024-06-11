import repliq from "../../repliq.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "repliq-launch-template",
  name: "Launch Repliq Template",
  description: "Launch a Repliq process by deploying the selected template. [See the documentation](https://developer.repliq.co/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    repliq,
    templateId: {
      propDefinition: [
        repliq,
        "templateId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.repliq.launchRepliqProcess({
      templateId: this.templateId,
    });
    $.export("$summary", `Successfully launched template with ID ${this.templateId}`);
    return response;
  },
};
