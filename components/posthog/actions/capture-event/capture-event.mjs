import posthog from "../../posthog.app.mjs";

export default {
  key: "posthog-capture-event",
  name: "Capture Event",
  description: "Captures a given event within the PostHog system. [See the documentation](https://posthog.com/docs/api/post-only-endpoints#single-event)",
  version: "0.0.1",
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
      propDefinition: [
        posthog,
        "properties",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.properties?.length) {
      return props;
    }
    const { results } = await this.posthog.listProperties({
      projectId: this.projectId,
      params: {
        properties: this.properties.join(),
      },
    });
    for (const property of results) {
      props[property.name] = {
        type: property.is_numerical
          ? "integer"
          : "string",
        label: `${property.name} Value`,
      };
    }
    return props;
  },
  async run({ $ }) {
    const properties = {};
    if (this.properties?.length) {
      for (const property of this.properties) {
        properties[property] = this[property];
      }
    }
    const { distinct_id: distinctId } = await this.posthog.getUser({
      $,
    });
    const response = await this.posthog.captureEvent({
      $,
      data: {
        event: this.event,
        api_key: this.projectApiKey,
        distinct_id: distinctId,
        properties,
      },
    });
    $.export("$summary", `Successfully captured event ${this.event}`);
    return response;
  },
};
