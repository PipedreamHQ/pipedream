import dreamdata from "../../dreamdata.app.mjs";
import { buildEvent } from "../../common/utils.mjs";

export default {
  key: "dreamdata-alias-user",
  name: "Alias User",
  description: "Merge two user identities, associating an existing identifier (`previousId`) with a new one (`userId`). [See the documentation](https://developer.dreamdata.io/server-side/server-side-tracking/).",
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
      type: "string",
      label: "User ID",
      description: "The new unique identifier for the user.",
    },
    previousId: {
      type: "string",
      label: "Previous ID",
      description: "The existing identifier to merge into the new User ID (typically a previous anonymous or temporary ID).",
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
    const event = buildEvent({
      type: "alias",
      userId: this.userId,
      previousId: this.previousId,
      messageId: this.messageId,
      timestamp: this.timestamp,
      context: this.context,
      integrations: this.integrations,
    });
    const response = await this.dreamdata.sendEvent({
      $,
      event,
    });
    $.export("$summary", `Aliased ${this.previousId} → ${this.userId}`);
    return response;
  },
};
