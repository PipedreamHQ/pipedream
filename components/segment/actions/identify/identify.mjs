import segmentApp from "../../segment.app.mjs";

export default {
  key: "segment-identify",
  name: "Identify a user, tie them to their actions and record traits about them",
  description: "Identify lets you tie a user to their actions and record traits about them. It includes a unique User ID and any optional traits you know about them (note requires userId or anonymousId). See the docs [here](https://segment.com/docs/connections/sources/catalog/libraries/server/http-api/#identify)",
  version: "0.2.6",
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
    timestamp: {
      propDefinition: [
        segmentApp,
        "timestamp",
      ],
    },
    traits: {
      type: "object",
      label: "Traits",
      description: "Free-form dictionary of traits of the user, like email or name.",
      optional: true,
    },
    userId: {
      propDefinition: [
        segmentApp,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    return this.segmentApp.identify({
      $,
      data: {
        anonymousId: this.anonymousId,
        context: this.context,
        integrations: this.integrations,
        timestamp: this.timestamp,
        traits: this.traits,
        userId: this.userId,
      },
    });
  },
};
