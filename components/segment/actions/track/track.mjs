import segmentApp from "../../segment.app.mjs";

export default {
  key: "segment-track",
  name: "Track actions your users perform",
  description: "Track lets you record the actions your users perform (note requires userId or anonymousId). See the docs [here](https://segment.com/docs/connections/sources/catalog/libraries/server/http-api/#track)",
  version: "0.3.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    segmentApp,
    anonymousId: {
      propDefinition: [
        segmentApp,
        "anonymousId",
      ],
    },
    context: {
      propDefinition: [
        segmentApp,
        "context",
      ],
    },
    event: {
      type: "string",
      label: "Event Name",
      description: "Name of the action that a user has performed.",
    },
    integrations: {
      propDefinition: [
        segmentApp,
        "integrations",
      ],
    },
    properties: {
      type: "object",
      label: "Event Properties",
      description: "Free-form dictionary of properties of the event, like revenue",
      optional: true,
    },
    timestamp: {
      propDefinition: [
        segmentApp,
        "timestamp",
      ],
    },
    userId: {
      propDefinition: [
        segmentApp,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    return this.segmentApp.track({
      $,
      data: {
        anonymousId: this.anonymousId,
        context: this.context,
        event: this.event,
        integrations: this.integrations,
        properties: this.properties,
        timestamp: this.timestamp,
        userId: this.userId,
      },
    });
  },
};
