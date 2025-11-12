import calendly from "../../calendly_v2.app.mjs";

export default {
  key: "calendly_v2-list-events",
  name: "List Events",
  description: "List events for an user. [See the documentation](https://calendly.stoplight.io/docs/api-docs/b3A6NTkxNDEy-list-events)",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    calendly,
    alert: {
      propDefinition: [
        calendly,
        "listEventsAlert",
      ],
    },
    scope: {
      propDefinition: [
        calendly,
        "listEventsScope",
      ],
      reloadProps: true,
    },
    organization: {
      propDefinition: [
        calendly,
        "organization",
      ],
      optional: true,
      hidden: true,
    },
    user: {
      propDefinition: [
        calendly,
        "user",
        (c) => ({
          organization: c.organization,
        }),
      ],
      description: "Returns events for a specified user",
      optional: true,
      hidden: true,
    },
    group: {
      propDefinition: [
        calendly,
        "groupId",
        (c) => ({
          organization: c.organization,
        }),
      ],
      description: "Returns events for a specified group",
      optional: true,
      hidden: true,
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
  async additionalProps(props) {
    return this.calendly.listEventsAdditionalProps(props, this.scope);
  },
  async run({ $ }) {
    const params = {
      invitee_email: this.inviteeEmail,
      status: this.status,
      paginate: this.paginate,
      maxResults: this.maxResults,
    };

    if (this.scope !== "authenticatedUser") {
      params.organization = this.organization;
    }
    if (this.scope === "user") {
      params.user = this.user;
    }
    if (this.scope === "group") {
      params.group = this.group;
    }

    const response = await this.calendly.listEvents(params, this.user, $);
    $.export("$summary", `Found ${response.pagination.count} event(s)`);
    return response;
  },
};
