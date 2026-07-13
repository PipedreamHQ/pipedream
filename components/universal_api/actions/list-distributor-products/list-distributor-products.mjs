import app from "../../universal_api.app.mjs";
import { DISTRIBUTOR_SERVICE_IDS } from "../../common/constants.mjs";

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
    serviceId: {
      propDefinition: [
        app,
        "serviceId",
      ],
      description: "Optional `x-uapi-service-id` header to pick the integration when a consumer has multiple active Distributor integrations. One of: `webmercs`, `netset`.",
      options: DISTRIBUTOR_SERVICE_IDS,
    },
  },
  async run({ $ }) {
    const response = await this.app.listDistributorProducts({
      $,
      serviceId: this.serviceId,
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} distributor product(s)`);
    return response;
  },
};
