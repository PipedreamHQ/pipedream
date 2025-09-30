import app from "../../webflow.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "webflow-list-orders",
  name: "List Orders",
  description: "List orders. [See the documentation](https://developers.webflow.com/data/reference/ecommerce/orders/list)",
  version: "2.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    siteId: {
      propDefinition: [
        app,
        "sites",
      ],
    },
    status: {
      label: "Status",
      description: "If specified, only orders with this status will be listed.",
      type: "string",
      options: constants.ORDER_STATUSES,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app, ...data
    } = this;
    const response = await app.listOrders(data);

    $.export("$summary", `Successfully retrieved ${response?.length} orders`);

    return response;
  },
};
