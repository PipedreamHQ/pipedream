import { ConfigurationError } from "@pipedream/platform";
import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-update-thread",
  name: "Update Thread",
  description: "Updates an existing thread's status or assigned owner. At least one of those fields must be provided. To archive a thread, use the **Archive Thread** action instead — HubSpot's API does not support archiving via PATCH. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-thread/patch-conversations-v3-conversations-threads-threadId)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    hubspot,
    inboxId: {
      propDefinition: [
        hubspot,
        "inboxId",
      ],
      optional: true,
    },
    channelId: {
      propDefinition: [
        hubspot,
        "channelId",
      ],
      optional: true,
    },
    threadId: {
      propDefinition: [
        hubspot,
        "threadId",
        (c) => ({
          inboxId: c.inboxId,
          channelId: c.channelId,
        }),
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "Set to `OPEN` to reactivate a closed thread or `CLOSED` to mark it as resolved",
      options: [
        "OPEN",
        "CLOSED",
      ],
      optional: true,
    },
    assignedOwnerId: {
      propDefinition: [
        hubspot,
        "senderActorId",
      ],
      label: "Assigned Owner",
      description: "Pick a HubSpot owner from the dropdown, or enter a custom expression with a fully-qualified actor ID (e.g. `A-12345` for owner/agent, `I-67890` for integration, `B-11111` for bot, `S-...` for system, `E-...` for email, `L-...` for LLM). Owner IDs without a type prefix are auto-prefixed with `A-`.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.status && !this.assignedOwnerId) {
      throw new ConfigurationError("At least one of Status or Assigned Owner must be provided.");
    }
    const data = {};
    if (this.status) {
      data.status = this.status;
    }
    if (this.assignedOwnerId) {
      data.assignedTo = /^[A-Z]-/.test(this.assignedOwnerId)
        ? this.assignedOwnerId
        : `A-${this.assignedOwnerId}`;
    }
    const response = await this.hubspot.updateThread({
      $,
      threadId: this.threadId,
      data,
    });
    $.export("$summary", `Updated thread ${this.threadId}`);
    return response;
  },
};
