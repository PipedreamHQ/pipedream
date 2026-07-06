import dreamdata from "../../dreamdata.app.mjs";
import { buildEvent } from "../../common/utils.mjs";

export default {
  key: "dreamdata-track-page-view",
  name: "Track Page View",
  description: "Record a page view. Either a User ID or an Anonymous ID is required. [See the documentation](https://developer.dreamdata.io/server-side/server-side-tracking/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    dreamdata,
    userId: {
      propDefinition: [
        dreamdata,
        "userId",
      ],
    },
    anonymousId: {
      propDefinition: [
        dreamdata,
        "anonymousId",
      ],
    },
    name: {
      type: "string",
      label: "Page Name",
      description: "Name of the page (e.g. `Pricing`).",
      optional: true,
    },
    category: {
      type: "string",
      label: "Page Category",
      description: "Category of the page (e.g. `Marketing`).",
      optional: true,
    },
    properties: {
      type: "object",
      label: "Properties",
      description: "Free-form dictionary of page properties, e.g. `{ \"url\": \"https://example.com/pricing\", \"referrer\": \"https://google.com\" }`.",
      optional: true,
    },
    messageId: {
      propDefinition: [
        dreamdata,
        "messageId",
      ],
    },
    timestamp: {
      propDefinition: [
        dreamdata,
        "timestamp",
      ],
    },
    context: {
      propDefinition: [
        dreamdata,
        "context",
      ],
    },
    integrations: {
      propDefinition: [
        dreamdata,
        "integrations",
      ],
    },
  },
  async run({ $ }) {
    if (!this.userId && !this.anonymousId) {
      throw new Error("Either User ID or Anonymous ID must be provided.");
    }
    const event = buildEvent({
      type: "page",
      userId: this.userId,
      anonymousId: this.anonymousId,
      name: this.name,
      category: this.category,
      properties: this.properties,
      messageId: this.messageId,
      timestamp: this.timestamp,
      context: this.context,
      integrations: this.integrations,
    });
    const response = await this.dreamdata.sendEvent({
      $,
      event,
    });
    $.export("$summary", `Tracked page view ${this.name ?? ""}`.trim());
    return response;
  },
};
