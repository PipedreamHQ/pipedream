import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-list-distributor-products",
  name: "List Distributor Products",
  description:
    "List products from the Distributors API on Universal API. [See the documentation](https://docs.universalapi.io/reference/list-products).",
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
    serviceId: {
      propDefinition: [
        app,
        "distributorServiceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listDistributorProducts({
      $,
      consumerId: this.consumerId,
      serviceId: this.serviceId,
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} distributor product(s)`);
    return response;
  },
};
