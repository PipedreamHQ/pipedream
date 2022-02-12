/* eslint camelcase: 0 */

import calendly_v2 from "../../calendly_v2.app.mjs";

export default {
  key: "calendly_v2-list-event-invitees",
  name: "List Event Invitees",
  description: "List invitees for an event. [See the docs](https://calendly.stoplight.io/docs/api-docs/b3A6NTkxNDEx-list-event-invitees)",
  version: "0.0.1",
  type: "action",
  props: {
    calendly_v2,
    eventId: {
      propDefinition: [
        calendly_v2,
        "eventId",
      ],
    },
    email: {
      propDefinition: [
        calendly_v2,
        "inviteeEmail",
      ],
      description: "Indicates if the results should be filtered by email address",
    },
    status: {
      propDefinition: [
        calendly_v2,
        "status",
      ],
      description: "Indicates if the invitee `canceled` or still `active`",
    },
    paginate: {
      propDefinition: [
        calendly_v2,
        "paginate",
      ],
    },
    maxResults: {
      propDefinition: [
        calendly_v2,
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

    const response = await this.calendly_v2.listEventInvitees(params, this.eventId, $);
    $.export("$summary", `Found ${response.pagination.count} event invitee(s)`);
    return response;
  },
};
