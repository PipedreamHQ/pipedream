import calendly from "../../calendly_v2.app.mjs";

export default {
  key: "calendly_v2-list-events",
  name: "List Events",
  description: "List events for an user. [See the docs](https://calendly.stoplight.io/docs/api-docs/b3A6NTkxNDEy-list-events)",
  version: "0.0.1",
  type: "action",
  props: {
    calendly,
    organization: {
      propDefinition: [
        calendly,
        "organization",
      ],
    },
    user: {
      propDefinition: [
        calendly,
        "user",
        (c) => ({
          organization: c.organization,
        }),
      ],
      description: "Returns events for a specified user, or leave blank for your own events",
      optional: true,
    },
    inviteeEmail: {
      propDefinition: [
        calendly,
        "inviteeEmail",
      ],
      description: "Return events that are scheduled with the invitee associated with this email address",
    },
    status: {
      propDefinition: [
        calendly,
        "status",
      ],
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
    if (this.inviteeEmail) params.invitee_email = this.inviteeEmail;
    if (this.status) params.status = this.status;
    if (this.paginate) params.paginate = this.paginate;
    if (this.maxResults) params.maxResults = this.maxResults;

    const response = await this.calendly.listEvents(params, this.user, $);
    $.export("$summary", `Found ${response.pagination.count} event(s)`);
    return response;
  },
};
