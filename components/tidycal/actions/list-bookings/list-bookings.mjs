import app from "../../tidycal.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "tidycal-list-bookings",
  name: "List Bookings",
  description: "Get a list of bookings. [See the documentation](https://tidycal.com/developer/docs/#tag/Bookings/operation/list-bookings)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    startsAt: {
      type: "string",
      label: "Starts At",
      description: "Get bookings starting from a specific date. Eg. `2023-08-22T15:30:00Z`",
      optional: true,
    },
    endsAt: {
      type: "string",
      label: "Ends At",
      description: "Get bookings ending before a specific date. Eg. `2023-08-22T15:45:00Z`",
      optional: true,
    },
    cancelled: {
      type: "boolean",
      label: "Cancelled",
      description: "Get only cancelled bookings.",
      optional: true,
    },
  },
  async run({ $: step }) {
    const {
      app,
      startsAt,
      endsAt,
      cancelled,
    } = this;

    const response = app.getResourcesStream({
      resourceFn: app.listBookings,
      resourceName: "data",
      resourceFnArgs: {
        params: {
          starts_at: startsAt,
          ends_at: endsAt,
          cancelled,
        },
      },
    });

    const resources = await utils.streamIterator(response);

    step.export("$summary", `Successfully retrieved ${utils.summaryEnd(resources.length, "booking")}.`);

    return resources;
  },
};
