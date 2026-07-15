import dreamdata from "../../dreamdata.app.mjs";
import { buildEvent } from "../../common/utils.mjs";

export default {
  key: "dreamdata-identify-user",
  name: "Identify User",
  description: "Tie a user to their actions and record traits about them. Either a User ID or an Anonymous ID is required. [See the documentation](https://developer.dreamdata.io/server-side/server-side-tracking/).",
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
    traits: {
      type: "object",
      label: "Traits",
      description: "Free-form dictionary of traits about the user, e.g. `{ \"email\": \"jane@acme.com\", \"name\": \"Jane Doe\", \"title\": \"VP Sales\" }`.",
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
      type: "identify",
      userId: this.userId,
      anonymousId: this.anonymousId,
      traits: this.traits,
      messageId: this.messageId,
      timestamp: this.timestamp,
      context: this.context,
      integrations: this.integrations,
    });
    const response = await this.dreamdata.sendEvent({
      $,
      event,
    });
    $.export("$summary", `Identified user ${this.userId ?? this.anonymousId}`);
    return response;
  },
};
