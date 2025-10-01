import posthog from "../../posthog.app.mjs";

export default {
  key: "posthog-capture-event",
  name: "Capture Event",
  description: "Captures a given event within the PostHog system. [See the documentation](https://posthog.com/docs/api/post-only-endpoints#single-event)",
  version: "0.0.3",
  type: "action",
  props: {
    posthog,
    projectApiKey: {
      type: "string",
      label: "Project API Key",
      description: "The Project API Key in your Project Settings. This key can only create new events. It can't read events or any of your other data stored with PostHog, so it's safe to use in public apps.",
    },
    organizationId: {
      propDefinition: [
        posthog,
        "organizationId",
      ],
    },
    projectId: {
      propDefinition: [
        posthog,
        "projectId",
        (c) => ({
          organizationId: c.organizationId,
        }),
      ],
    },
    event: {
      propDefinition: [
        posthog,
        "event",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    properties: {
      type: "object",
      label: "Properties",
      description: "The properties to include in the event",
      optional: true,
    },
  },
  async run({ $ }) {
    const properties = typeof this.properties === "string"
      ? JSON.parse(this.properties)
      : this.properties;
    const { distinct_id: distinctId } = await this.posthog.getUser({
      $,
    });
    const response = await this.posthog.captureEvent({
      $,
      data: {
        event: this.event,
        api_key: this.projectApiKey,
        properties: {
          ...properties,
          distinct_id: distinctId,
        },
      },
    });
    $.export("$summary", `Successfully captured event ${this.event}`);
    return response;
  },
};
