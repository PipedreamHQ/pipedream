import ticketSource from "../../ticket_source.app.mjs";

export default {
  key: "ticket_source-list-events",
  name: "List Events",
  description: "Retrieves a list of all events. [See the documentation](https://reference.ticketsource.io/#/operations/get-events/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ticketSource,
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Optionally limit the maximum number of events to return. Leave blank to retrieve all events.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = this.ticketSource.paginate({
      $,
      fn: this.ticketSource.listEvents,
      maxResults: this.maxResults,
    });

    const events = [];
    for await (const event of response) {
      events.push(event);
    }

    $.export("$summary", `Successfully retrieved ${events.length} event${events.length === 1
      ? ""
      : "s"}`);
    return events;
  },
};

