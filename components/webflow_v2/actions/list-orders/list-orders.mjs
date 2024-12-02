import app from "../../webflow_v2.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "webflow_v2-list-orders",
  name: "List Orders",
  description: "List orders. [See the docs here](https://developers.webflow.com/#get-all-orders)",
  version: "0.0.1",
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
