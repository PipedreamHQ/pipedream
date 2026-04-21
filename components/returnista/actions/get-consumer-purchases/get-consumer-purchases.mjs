import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-get-consumer-purchases",
  name: "Get Consumer Purchases",
  description: "Get consumer purchases. [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/consumer/-consumerId/purchases)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    returnista,
    consumerId: {
      propDefinition: [
        returnista,
        "consumerId",
      ],
    },
  },
  async run({ $ }) {
    const { data: response } = await this.returnista.getConsumerPurchases({
      $,
      consumerId: this.consumerId,
    });
    $.export("$summary", `Successfully retrieved ${response.length} consumer purchases`);
    return response;
  },
};
