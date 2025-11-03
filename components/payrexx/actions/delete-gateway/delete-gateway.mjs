import payrexx from "../../payrexx.app.mjs";

export default {
  key: "payrexx-delete-gateway",
  name: "Delete Gateway",
  description: "Delete a gateway. [See the documentation](https://developers.payrexx.com/reference/delete-a-gateway)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    payrexx,
    gatewayId: {
      propDefinition: [
        payrexx,
        "gatewayId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.payrexx.deleteGateway({
      $,
      gatewayId: this.gatewayId,
    });

    $.export("$summary", `Successfully deleted gateway with ID ${this.gatewayId}.`);

    return response;
  },
};
