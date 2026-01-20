import app from "../../crowdpower.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "crowdpower-create-customer-event",
  name: "Create Customer Event",
  description: "Create a new event related to a customer. [See the documentation](https://documenter.getpostman.com/view/17896162/UV5TFKbh#63159fcd-7df3-46c5-ac83-eeb72678b650)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    userId: {
      propDefinition: [
        app,
        "userId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    properties: {
      propDefinition: [
        app,
        "properties",
      ],
    },
    action: {
      propDefinition: [
        app,
        "action",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createCustomerEvent({
      $,
      data: {
        user_id: this.userId,
        action: this.action,
        properties: this.properties && parseObject(this.properties),
      },
    });
    $.export("$summary", response.success
      ? `Request succeeded with code ${response.code}`
      : `Request failed with code ${response.code}`);
    return response;
  },
};
