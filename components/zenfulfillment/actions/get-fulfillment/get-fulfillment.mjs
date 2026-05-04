import zenfulfillment from "../../zenfulfillment.app.mjs";

export default {
  key: "zenfulfillment-get-fulfillment",
  name: "Get Fulfillment",
  description: "Get a fulfillment by ID. [See the documentation](https://partner.alaiko.com/docs#tag/Fulfillment/operation/api_partnerfulfillment_id_get)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zenfulfillment,
    fulfillmentId: {
      propDefinition: [
        zenfulfillment,
        "fulfillmentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zenfulfillment.getFulfillment({
      $,
      fulfillmentId: this.fulfillmentId,
    });
    $.export("$summary", `Successfully retrieved fulfillment with ID \`${this.fulfillmentId}\`.`);
    return response;
  },
};
