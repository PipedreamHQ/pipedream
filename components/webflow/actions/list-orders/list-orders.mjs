import webflow from "../../webflow.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "webflow-list-orders",
  name: "List Orders",
  description: "List orders. [See the docs here](https://developers.webflow.com/#get-all-orders)",
  version: "0.0.1",
  type: "action",
  props: {
    webflow,
    siteId: {
      propDefinition: [
        webflow,
        "sites",
      ],
    },
    status: {
      label: "Status",
      description: "The status to filter the orders.",
      type: "string",
      options: constants.ORDER_STATUSES,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.webflow.getOrders({
      siteId: this.siteId,
      status: this.status,
    });

    $.export("$summary", "Successfully retrieved orders");

    return response;
  },
};
