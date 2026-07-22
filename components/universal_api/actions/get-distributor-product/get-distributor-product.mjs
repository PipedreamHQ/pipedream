import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-get-distributor-product",
  name: "Get Distributor Product",
  description:
    "Retrieve a single distributor product by ID from Universal API. Run **List Distributor Products** first to discover valid IDs. [See the documentation](https://docs.universalapi.io/reference/get-product).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    consumerId: {
      propDefinition: [
        app,
        "consumerId",
      ],
    },
    productId: {
      propDefinition: [
        app,
        "productId",
      ],
    },
    distributorServiceId: {
      propDefinition: [
        app,
        "distributorServiceId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.getDistributorProduct({
      $,
      consumerId: this.consumerId,
      productId: this.productId,
      serviceId: this.distributorServiceId,
    });
    $.export("$summary", `Successfully retrieved distributor product ${this.productId}`);
    return response;
  },
};
