import segmentApp from "../../segment.app.mjs";

export default {
  key: "segment-group",
  name: "Associate an identified user with a group",
  description: "Group lets you associate an identified user with a group (note requires userId or anonymousId). See the docs [here](https://segment.com/docs/connections/sources/catalog/libraries/server/http-api/#group)",
  version: "0.2.5",
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
    groupId: {
      type: "string",
      label: "Group ID",
      description: "A unique identifier for the group in your database.",
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
      description: "Free-form dictionary of traits of the group, like email or name.",
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
    return this.segmentApp.group({
      $,
      data: {
        anonymousId: this.anonymousId,
        context: this.context,
        groupId: this.groupId,
        integrations: this.integrations,
        timestamp: this.timestamp,
        traits: this.traits,
        userId: this.userId,
      },
    });
  },
};
