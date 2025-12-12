import app from "../../crowdpower.app.mjs";

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
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    customAttributes: {
      propDefinition: [
        app,
        "customAttributes",
      ],
      description: "Custom attributes of the event",
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
        custom_attributes: this.customAttributes,
        action: this.action,
      },
    });
    $.export("$summary", response.success
      ? `Request succeeded with code ${response.code}`
      : `Request failed with code ${response.code}`);
    return response;
  },
};
