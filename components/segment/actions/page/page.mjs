import segmentApp from "../../segment.app.mjs";

export default {
  key: "segment-page",
  name: "Record page views on your website",
  description: "The page method lets you record page views on your website, along with optional extra information about the page being viewed (note requires userId or anonymousId). See the docs [here](https://segment.com/docs/connections/sources/catalog/libraries/server/http-api/#page)",
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
    integrations: {
      propDefinition: [
        segmentApp,
        "integrations",
      ],
    },
    label: {
      type: "string",
      label: "Page Name",
      description: "Name of the page",
      optional: true,
    },
    properties: {
      type: "object",
      label: "Page Properties",
      description: "Free-form dictionary of properties of the page, like url and referrer",
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
    return this.segmentApp.page({
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
