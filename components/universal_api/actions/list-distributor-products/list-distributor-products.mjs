import app from "../../universal_api.app.mjs";
import { DISTRIBUTOR_SERVICE_IDS } from "../../common/constants.mjs";

export default {
  key: "universal_api-list-distributor-products",
  name: "List Distributor Products",
  description:
    "List products from the Distributors API on Universal API. Returns an array (paginated internally, up to `maxResults`). [See the documentation](https://docs.universalapi.io/reference/list-products).",
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
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      data, hasMore,
    } = await this.app.paginate({
      fn: this.app.listDistributorProducts,
      args: {
        $,
        serviceId: this.serviceId,
      },
      maxResults: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${data.length} distributor product(s)`);
    return {
      data,
      hasMore,
    };
  },
};
