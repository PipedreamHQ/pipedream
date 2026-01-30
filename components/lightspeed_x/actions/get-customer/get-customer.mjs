import lightspeedX from "../../lightspeed_x.app.mjs";

export default {
  key: "lightspeed_x-get-customer",
  name: "Get Customer",
  description: "Retrieves details of a customer. [See the documentation](https://x-series-api.lightspeedhq.com/v2026.01/reference/getcustomerbyid)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    lightspeedX,
    customerId: {
      propDefinition: [
        lightspeedX,
        "customerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lightspeedX.getCustomer({
      $,
      customerId: this.customerId,
    });
    $.export("$summary", `Successfully retrieved customer ${this.customerId}`);
    return response;
  },
};
