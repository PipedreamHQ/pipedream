import calendly from "../../calendly_v2.app.mjs";

export default {
  key: "calendly_v2-list-event-invitees",
  name: "List Event Invitees",
  description: "List invitees for an event. [See the documentation](https://calendly.stoplight.io/docs/api-docs/b3A6NTkxNDEx-list-event-invitees)",
  version: "0.0.7",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
