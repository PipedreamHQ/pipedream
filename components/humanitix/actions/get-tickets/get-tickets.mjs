import humanitix from "../../humanitix.app.mjs";

export default {
  key: "humanitix-get-tickets",
  name: "Get Tickets",
  description: "Retrieves a list of tickets from Humanitix. [See the documentation](https://humanitix.stoplight.io/docs/humanitix-public-api/e508a657c1467-humanitix-public-api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    humanitix,
    eventId: {
      propDefinition: [
        humanitix,
        "eventId",
      ],
    },
    overrideLocation: {
      propDefinition: [
        humanitix,
        "overrideLocation",
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "Ticket status you wish to fetch",
      optional: true,
      options: [
        "complete",
        "cancelled",
      ],
    },
    since: {
      propDefinition: [
        humanitix,
        "since",
      ],
    },
    maxResults: {
      propDefinition: [
        humanitix,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const response = this.humanitix.paginate({
      $,
      eventId: this.eventId,
      fn: this.humanitix.getTickets,
      maxResults: this.maxResults,
      dataField: "tickets",
    });

    const tickets = [];
    for await (const ticket of response) {
      tickets.push(ticket);
    }

    $.export("$summary", `Successfully retrieved ${tickets.length} ticket${tickets.length === 1
      ? ""
      : "s"}`);
    return tickets;
  },
};
