import calendly from "../../calendly_v2.app.mjs";

export default {
  key: "calendly_v2-list-events",
  name: "List Events",
  description: "List events for an user. [See the documentation](https://calendly.stoplight.io/docs/api-docs/b3A6NTkxNDEy-list-events)",
  version: "0.0.6",
  type: "action",
  props: {
    calendly,
    alert: {
      type: "alert",
      alertType: "info",
      content: `
      Select "authenticatedUser" scope to return events for the authenticated user
      Select "organization" scope to return events for that organization (requires admin/owner privilege)
      Select "user" scope to return events for a specific User in your organization (requires admin/owner privilege)
      Select "group" scope to return events for a specific Group (requires organization admin/owner or group admin privilege)`,
    },
    scope: {
      type: "string",
      label: "Scope",
      description: "The scope to fetch events for",
      options: [
        "authenticatedUser",
        "organization",
        "user",
        "group",
      ],
      default: "authenticatedUser",
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
    props.organization.hidden = this.scope === "authenticatedUser";
    props.organization.optional = this.scope === "authenticatedUser";

    props.group.hidden = this.scope !== "group";
    props.group.optional = this.scope !== "group";

    props.user.hidden = this.scope !== "user";
    props.user.optional = this.scope !== "user";

    return {};
  },
  async run({ $ }) {
    const params = {
      inviteeEmail: this.inviteeEmail,
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
