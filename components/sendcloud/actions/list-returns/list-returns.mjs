import app from "../../sendcloud.app.mjs";

export default {
  key: "sendcloud-list-returns",
  name: "List Returns",
  description: "List returns. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/returns/operations/list-returns)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    fromDate: {
      type: "string",
      label: "From Date",
      description: "Excludes all returns before this datetime. Example: `2022-04-06 00:00:00`",
    },
    toDate: {
      type: "string",
      label: "To Date",
      description: "Excludes all returns after this datetime. Example: `2022-04-07 00:00:00`",
    },
    parentParcelStatus: {
      type: "string",
      label: "Parent Parcel Status",
      description: "Search for returns with this parent status.",
      optional: true,
      options: [
        "ready-to-send",
        "announced",
        "to-sorting",
        "delayed",
        "sorted",
        "unsorted",
        "sorting",
        "delivery-failed",
        "delivery-forced",
        "delivered",
        "awaiting-customer-pickup",
        "announced-uncollected",
        "collect-error",
        "unsorted2",
        "undeliverable",
        "shipment-on-route",
        "driver-on-route",
        "picked-up-by-driver",
        "collected-by-customer",
        "no-label",
        "announcing",
        "cancelling-upstream",
        "cancelling",
        "cancelled",
        "cancelled-upstream",
        "unknown",
        "announcement-failed",
        "at-customs",
        "at-sorting-centre",
        "refused-by-recipient",
        "returned-to-sender",
        "delivery-method-changed",
        "delivery-date-changed",
        "delivery-address-changed",
        "exception",
        "address-invalid",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      parentParcelStatus,
      fromDate,
      toDate,
    } = this;

    const response = await app.listReturns({
      $,
      params: {
        parent_parcel_status: parentParcelStatus,
        from_date: fromDate,
        to_date: toDate,
      },
    });

    $.export("$summary", "Successfully listed returns");

    return response;
  },
};

