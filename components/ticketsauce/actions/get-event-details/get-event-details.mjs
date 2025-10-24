import ticketsauce from "../../ticketsauce.app.mjs";

export default {
  key: "ticketsauce-get-event-details",
  name: "Get Event Details",
  description: "Get details for a specified event. [See documentation](https://speca.io/ticketsauce/ticketsauce-public-api?key=204000d6bda66da78315e721920f43aa#event-details)",
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
    photos: {
      type: "boolean",
      label: "Photos",
      description: "Whether or not to return the event's photo gallery records.",
      optional: true,
      default: false,
    },
    includePerformers: {
      propDefinition: [
        ticketsauce,
        "includePerformers",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      photos: this.photos ?
        1 :
        0,
      include_performers: String(this.includePerformers),
    };

    const response = await this.ticketsauce.getEventDetails($, {
      eventId: this.eventId,
      params,
    });

    $.export("$summary", `Successfully retrieved details for event ID: ${this.eventId}`);
    return response;
  },
};
