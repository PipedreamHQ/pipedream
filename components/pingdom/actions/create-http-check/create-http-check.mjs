import pingdom from "../../pingdom.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "pingdom-create-http-check",
  name: "Create HTTP Check",
  description: "Creates a new HTTP check in Pingdom. [See the documentation](https://docs.pingdom.com/api/#tag/Checks/paths/~1checks/post)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    pingdom,
    checkName: {
      propDefinition: [
        pingdom,
        "checkName",
      ],
    },
    host: {
      propDefinition: [
        pingdom,
        "host",
      ],
    },
    type: {
      propDefinition: [
        pingdom,
        "type",
      ],
    },
    // Include other required and optional prop definitions here.
  },
  async run({ $ }) {
    const otherOpts = {}; // This object should include other optional props that can be defined above and passed here.
    const response = await this.pingdom.createCheck({
      checkName: this.checkName,
      host: this.host,
      type: this.type,
      ...otherOpts,
    });

    const checkId = response?.check?.id; // Assuming the response contains the check object with an id property.
    $.export("$summary", `Successfully created HTTP check with name: ${this.checkName} and ID: ${checkId}`);
    return response;
  },
};
