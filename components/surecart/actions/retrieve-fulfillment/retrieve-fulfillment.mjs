import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-fulfillment",
  name: "Retrieve Fulfillment",
  description: "Retrieve a fulfillment by ID. [See the documentation](https://developer.surecart.com/api-reference/fulfillments/retrieve)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    fulfillmentId: {
      propDefinition: [
        surecart,
        "fulfillmentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.getFulfillment({
      $,
      fulfillmentId: this.fulfillmentId,
    });
    $.export("$summary", `Successfully retrieved fulfillment ${this.fulfillmentId}`);
    return response;
  },
};
