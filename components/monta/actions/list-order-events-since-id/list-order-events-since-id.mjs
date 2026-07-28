import monta from "../../monta.app.mjs";

export default {
  key: "monta-list-order-events-since-id",
  name: "List Order Events Since ID",
  description: "List order change events created after the provided cursor ID, which is Monta's recommended method for reliable status-change polling. Use this for incremental syncing across all orders; see **List Order Events** for a single order's history or **List Updated Orders** for datetime-based bulk syncing. [See the documentation](https://api-v6.monta.nl/index.html#tag/OrderEvent/paths/~1orderevents~1since_id~1%7Bid%7D/get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monta,
    sinceId: {
      type: "integer",
      label: "Since ID",
      description: "Return events created after this event ID. Use `0` to start from the beginning.",
    },
    includeWmsEvents: {
      type: "boolean",
      label: "Include WMS Events",
      description: "Whether to include warehouse management system events",
      optional: true,
    },
  },
  async run({ $ }) {
    const events = await this.monta.listOrderEventsSinceId({
      $,
      id: this.sinceId,
      params: {
        includeWMSEvents: this.includeWmsEvents,
      },
    });

    $.export("$summary", `Successfully retrieved ${events.length} order event${events.length === 1
      ? ""
      : "s"}`);

    return events;
  },
};
