import monta from "../../monta.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "monta-list-updated-orders",
  name: "List Updated Orders",
  description: "List orders whose status changed since a specified date and time, including orders deleted since then. Use this for reliable bulk order syncing; for cursor-based incremental polling of individual change events, use **List Order Events Since ID** instead. [See the documentation](https://api-v6.monta.nl/index.html#tag/Order/paths/~1order~1updated_since~1%7BupdatedSince%7D/get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monta,
    updatedSince: {
      type: "string",
      label: "Updated Since",
      description: "The start date and time in ISO 8601 format (e.g. `2026-07-24T00:00:00Z`)",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter orders by their deleted status",
      options: constants.ORDER_UPDATED_SINCE_STATUSES,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.monta.listUpdatedOrders({
      $,
      updatedSince: this.updatedSince,
      params: {
        status: this.status,
      },
    });
    const orders = response.Orders ?? [];

    $.export("$summary", `Successfully retrieved ${orders.length} updated order${orders.length === 1
      ? ""
      : "s"}`);

    return orders;
  },
};
