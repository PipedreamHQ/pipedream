import segmentApp from "../../segment.app.mjs";

export default {
  key: "segment-screen",
  name: "Record whenever a user sees a screen",
  description: "The screen method let you record whenever a user sees a screen of your mobile app (note requires userId or anonymousId). See the docs [here](https://segment.com/docs/connections/sources/catalog/libraries/server/http-api/#screen)",
  version: "0.1.5",
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
    integrations: {
      propDefinition: [
        segmentApp,
        "integrations",
      ],
    },
    label: {
      type: "string",
      label: "Screen Name",
      description: "Name of the screen",
      optional: true,
    },
    properties: {
      type: "object",
      label: "Screen Properties",
      description: "Free-form dictionary of properties of the screen, like name",
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
    return this.segmentApp.screen({
      $,
      data: {
        anonymousId: this.anonymousId,
        context: this.context,
        integrations: this.integrations,
        label: this.name,
        properties: this.properties,
        timestamp: this.timestamp,
        userId: this.userId,
      },
    });
  },
};
