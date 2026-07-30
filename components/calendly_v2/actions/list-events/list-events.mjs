// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import calendly from "../../calendly_v2.app.mjs";

export default {
  key: "calendly_v2-list-events",
  name: "List Events",
  description: "List scheduled Calendly events. Scope the results by providing at most one of Organization URI, User URI, or Group UUID; if none is provided, events for the authenticated user are returned (supplying more than one raises a configuration error). Narrow the results further with an invitee email to return only events scheduled with that invitee. Filter by date range using `Min Start Time` and/or `Max Start Time`, both ISO 8601 datetimes in UTC (e.g. `2026-08-01T00:00:00Z`). Each returned event includes a `uri`; the trailing UUID segment is the event UUID used by downstream actions such as **Get Event**, **List Event Invitees**, **Get Event Invitee**, and **Cancel Event**. Example: called with no props, returns the authenticated user's upcoming events, each like `{ name: \"30 Minute Meeting\", uri: \"https://api.calendly.com/scheduled_events/a1b2c3d4-e5f6-7890-abcd-ef1234567890\", status: \"active\" }`. [See the documentation](https://calendly.stoplight.io/docs/api-docs/b3A6NTkxNDEy-list-events)",
  version: "0.0.9",
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
      user,
    };

    const response = await this.calendly.listEvents(params, $);
    $.export("$summary", `Found ${response.pagination.count} event(s)`);
    return response;
  },
};
