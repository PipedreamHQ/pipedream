import app from "../../app/wildberries.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "List Orders",
  description: "Returns a list of orders. [See docs here](https://suppliers-api.wildberries.ru/swagger/index.html#/Marketplace/get_api_v2_orders)",
  key: "wildberries-list-orders",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    dateStart: {
      type: "string",
      label: "Starting date",
      description: "Starting date for querying in [RFC3339](https://www.rfc-editor.org/rfc/rfc3339) format.",
    },
    dateEnd: {
      type: "string",
      label: "Ending date",
      description: "Ending date for querying in [RFC3339](https://www.rfc-editor.org/rfc/rfc3339) format.",
      optional: true,
    },
    status: {
      propDefinition: [
        app,
        "status",
      ],
      optional: true,
      description: "Select by status",
    },
    take: {
      type: "integer",
      label: "Take",
      description: "How many records to return at a time.",
      default: 10,
    },
    skip: {
      type: "integer",
      label: "Skip",
      description: "How many records to skip.",
      default: 0,
    },
    orderId: {
      propDefinition: [
        app,
        "orderId",
      ],
      description: "Select by order id",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      date_start: this.dateStart,
      date_end: this.dateEnd,
      status: typeof (this.status) !== "undefined" ?
        parseInt(this.status) :
        null,
      take: this.take,
      skip: this.skip,
      id: this.orderId,
    };
    const response = await this.app.listOrders($, params);
    $.export("$summary", `Successfully fetched ${response.orders.length} orders`);
    return response;
  },
});
