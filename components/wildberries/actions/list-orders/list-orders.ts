import app from "../../app/wildberries.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "List Orders",
  description: "Returns a list of orders. [See docs](https://suppliers-api.wildberries.ru/swagger/index.html#/Marketplace/get_api_v2_orders)",
  key: "wildberries-list-orders",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    dateStart: {
      type: "string",
      label: "Starting date",
      description: "Starting date for querying",
    },
    dateEnd: {
      type: "string",
      label: "End date",
      description: "Ending date for querying",
      optional: true,
    },
    status: {
      type: "integer",
      label: "Status",
      description: "Select by status",
      optional: true,
      options: [
        {
          label: "New order",
          value: 0,
        },
        {
          label: "Accepted the order",
          value: 1,
        },
        {
          label: "Assembly task completed",
          value: 2,
        },
        {
          label: "Assembly order rejected",
          value: 3,
        },
        {
          label: "On delivery by courier",
          value: 5,
        },
        {
          label: "The client received the goods (courier delivery and pickup)",
          value: 6,
        },
        {
          label: "The client did not accept the goods (courier delivery and pickup)",
          value: 7,
        },
        {
          label: "Goods for pickup from the store accepted for work",
          value: 8,
        },
        {
          label: "Product for self-pickup from the store is ready for pickup",
          value: 9,
        },
      ],
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
      type: "integer",
      label: "Order Id",
      description: "Select by order id",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      date_start: this.dateStart,
      date_end: this.dateEnd,
      status: this.status,
      take: this.take,
      skip: this.skip,
      id: this.orderId,
    };
    const ordersWrapper = await this.app.listOrders($, params);
    $.export("$summary", `Successfully fetched ${ordersWrapper.orders.length} orders`);
    return ordersWrapper;
  },
});
