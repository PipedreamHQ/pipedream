import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-delete-fulfillment",
  name: "Delete Fulfillment",
  description: "Delete a fulfillment by ID. [See the documentation](https://developer.surecart.com/api-reference/fulfillments/delete)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.surecart.deleteFulfillment({
      $,
      fulfillmentId: this.fulfillmentId,
    });
    $.export("$summary", `Successfully deleted fulfillment ${this.fulfillmentId}`);
    return response;
  },
};
