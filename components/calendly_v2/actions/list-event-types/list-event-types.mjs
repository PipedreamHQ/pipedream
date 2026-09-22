import { ConfigurationError } from "@pipedream/platform";
import calendly from "../../calendly_v2.app.mjs";

export default {
  key: "calendly_v2-list-event-types",
  name: "List Event Types",
  description: "Retrieve the event types available to a user or organization via `GET /event_types`. Use this to discover valid event type URIs and UUIDs for scheduling flows. Provide either an Organization URI or a User URI; if neither is provided the authenticated user is used. Use **List Organization Memberships** to find user and organization URIs. Example: called with no props, returns the authenticated user's event types such as `{ name: \"30 Minute Meeting\", uuid: \"AAAAAAAAAAAAAAAA\" }` — pass that `uuid` as the `owner` prop in **Create a Scheduling Link**. [See the documentation](https://developer.calendly.com/api-docs/25a4ece03c1bc-list-user-s-event-types).",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    calendly,
    organization: {
      propDefinition: [
        calendly,
        "organization",
      ],
      optional: true,
    },
    user: {
      propDefinition: [
        calendly,
        "user",
      ],
      optional: true,
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
    if (this.organization && this.user) {
      throw new ConfigurationError("Provide either Organization or User, not both.");
    }

    const userUri = this.user ||
      (!this.organization
        ? await this.calendly.defaultUser($)
        : undefined);

    const response = await this.calendly.listEventTypes({
      organization: this.organization,
      user: userUri,
      paginate: this.paginate,
      maxResults: this.maxResults,
    }, $);

    // The Calendly API returns `uri` but not a top-level `uuid` field.
    // Extract the UUID from the URI so downstream components and agents
    // can reference it directly (e.g. as the eventType prop in other actions).
    response.collection = response.collection.map((eventType) => ({
      ...eventType,
      uuid: eventType.uri.split("/").pop(),
    }));

    $.export("$summary", `Found ${response.pagination.count} event type(s)`);
    return response;
  },
};
