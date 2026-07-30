// x-pd-ai: optimized
import calendly from "../../calendly_v2.app.mjs";

export default {
  key: "calendly_v2-list-event-invitees",
  name: "List Event Invitees",
  description: "List the invitees for a scheduled event via `GET /scheduled_events/{uuid}/invitees`. Run **List Events** first to obtain the event UUID. Example: call with `eventId` set to `a1b2c3d4-e5f6-7890-abcd-ef1234567890` and `status` set to `active` to return only that event's non-canceled invitees, each with a `uri` whose trailing segment is the invitee UUID used by **Get Event Invitee** and **Create Invitee No Show**. [See the documentation](https://calendly.stoplight.io/docs/api-docs/b3A6NTkxNDEx-list-event-invitees)",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    calendly,
    eventId: {
      propDefinition: [
        calendly,
        "eventId",
      ],
    },
    email: {
      propDefinition: [
        calendly,
        "inviteeEmail",
      ],
      description: "Indicates if the results should be filtered by email address",
    },
    status: {
      propDefinition: [
        calendly,
        "status",
      ],
      description: "Indicates if the invitee `canceled` or still `active`",
    },
    paginate: {
      propDefinition: [
        calendly,
        "paginate",
      ],
    },
    maxResults: {
      propDefinition: [
        calendly,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.email) params.email = this.email;
    if (this.status) params.status = this.status;
    if (this.paginate) params.paginate = this.paginate;
    if (this.maxResults) params.maxResults = this.maxResults;

    const response = await this.calendly.listEventInvitees(params, this.eventId, $);
    $.export("$summary", `Found ${response.pagination.count} event invitee(s)`);
    return response;
  },
};
