// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
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
    organization: {
      propDefinition: [
        calendly,
        "organization",
      ],
      description: "Returns events for the specified organization. Provide only one of Organization, User, or Group.",
      optional: true,
    },
    user: {
      propDefinition: [
        calendly,
        "user",
        (c) => ({
          organization: c.organization,
        }),
      ],
      description: "Returns events for the specified user. Provide only one of Organization, User, or Group.",
      optional: true,
    },
    group: {
      propDefinition: [
        calendly,
        "groupId",
        (c) => ({
          organization: c.organization,
        }),
      ],
      description: "Returns events for the specified group. Provide only one of Organization, User, or Group.",
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
    minStartTime: {
      type: "string",
      label: "Min Start Time",
      description: "Include only events with start times on or after this ISO 8601 datetime in UTC, e.g. `2026-08-01T00:00:00Z`. Maps to the `min_start_time` query param.",
      optional: true,
    },
    maxStartTime: {
      type: "string",
      label: "Max Start Time",
      description: "Include only events with start times prior to this ISO 8601 datetime in UTC, e.g. `2026-08-31T23:59:59Z`. Maps to the `max_start_time` query param.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      organization, user, group,
    } = this;

    if ([
      organization,
      user,
      group,
    ].filter(Boolean).length > 1) {
      throw new ConfigurationError("Provide only one of Organization, User, or Group.");
    }

    const params = {
      invitee_email: this.inviteeEmail,
      status: this.status,
      paginate: this.paginate,
      maxResults: this.maxResults,
      min_start_time: this.minStartTime,
      max_start_time: this.maxStartTime,
      organization,
      group,
    };

    const response = await this.calendly.listEvents(params, user, $);
    $.export("$summary", `Found ${response.pagination.count} event(s)`);
    return response;
  },
};
