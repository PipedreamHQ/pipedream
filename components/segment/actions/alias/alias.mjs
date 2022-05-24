import segmentApp from "../../segment.app.mjs";

export default {
  key: "segment-alias",
  label: "Associate one identity with another",
  description: "Alias is how you associate one identity with another. See the docs [here](https://segment.com/docs/connections/sources/catalog/libraries/server/http-api/#alias)",
  version: "0.1.2",
  type: "action",
  props: {
    segmentApp,
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
    previousId: {
      type: "string",
      label: "Previous ID",
      description: "Previous unique identifier for the user",
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
    return this.segmentApp.alias({
      $,
      data: {
        context: this.context,
        integrations: this.integrations,
        previousId: this.previousId,
        timestamp: this.timestamp,
        userId: this.userId,
      },
    });
  },
};
