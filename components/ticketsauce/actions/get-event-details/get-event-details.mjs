import ticketsauce from "../../ticketsauce.app.mjs";

export default {
  key: "ticketsauce-get-event-details",
  name: "Get Event Details",
  description: "Get details for a specified event. [See documentation](https://speca.io/ticketsauce/ticketsauce-public-api?key=204000d6bda66da78315e721920f43aa#event-details)",
  version: "0.0.1",
  type: "action",
  props: {
    ticketsauce,
    partnerId: {
      type: "string",
      label: "Partner ID",
      description: "Including this ID will limit the event selection to the specific partner.",
      optional: true,
    },
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "Including this ID will limit the event selection to the specific organization.",
      optional: true,
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
      type: "string",
      label: "Photos",
      description: "Whether or not to return the event's photo gallery records.",
      optional: true,
      default: "0",
      options: [
        "0",
        "1"
      ],
    },
    includePerformers: {
      type: "boolean",
      label: "Include Performers",
      description: "Returns any associated performers/artists with the event.",
      optional: true,
      default: false,
    },
  },
  async run() {
    const params = {
      photos: this.photos,
      include_performers: this.includePerformers,
    };

    return this.ticketsauce.getEventDetails({
      eventId: this.eventId,
      params,
    });
  },
};
