import ticketsauce from "../../ticketsauce.app.mjs";

export default {
  key: "ticketsauce-get-ticket-checkin-ids",
  name: "Get Ticket Check-in IDs",
  description: "Get a list of ticket check-in IDs from the specified event. [See documentation](https://speca.io/ticketsauce/ticketsauce-public-api?key=204000d6bda66da78315e721920f43aa#ticket-checkin-ids)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ticketsauce,
    partnerId: {
      propDefinition: [
        ticketsauce,
        "partnerId",
      ],
    },
    organizationId: {
      propDefinition: [
        ticketsauce,
        "organizationId",
      ],
    },
    eventId: {
      propDefinition: [
        ticketsauce,
        "eventId",
        (c) => ({
          partnerId: c.partnerId,
          organizationId: c.organizationId,
        }),
      ],
    },
    perPage: {
      type: "string",
      label: "Per Page",
      description: "How many results to retrieve (per page). Max 5000.",
      optional: true,
    },
    page: {
      type: "string",
      label: "Page",
      description: "Which page to return. For example, if per_page is 20, and page is 3, the results would show 41-60.",
      optional: true,
      default: "1",
    },
  },
  async run({ $ }) {
    const params = {
      per_page: this.perPage,
      page: this.page,
    };

    const response = await this.ticketsauce.getTicketCheckinIds($, {
      eventId: this.eventId,
      params,
    });

    $.export("$summary", `Successfully retrieved ticket check-in IDs for event ID: ${this.eventId}`);
    return response;
  },
};
