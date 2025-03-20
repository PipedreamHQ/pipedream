import kustomer from "../../kustomer.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "kustomer-create-conversation",
  name: "Create Conversation",
  description: "Creates a new conversation in Kustomer. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    kustomer,

    // Required prop
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Unique identifier for the customer",
    },

    // Optional props
    externalId: {
      type: "string",
      label: "External ID",
      description: "External identifier",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the conversation",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the conversation",
      optional: true,
    },
    priority: {
      type: "integer",
      label: "Priority",
      description: "Priority level (1-5)",
      optional: true,
      min: 1,
      max: 5,
    },
    direction: {
      type: "string",
      label: "Direction",
      description: "Direction of the conversation",
      optional: true,
    },
    replyChannel: {
      type: "string",
      label: "Reply Channel",
      description: "Channel to reply to",
      optional: true,
    },
    tags: {
      propDefinition: [
        kustomer,
        "tags",
      ],
      optional: true,
    },
    assignedUsers: {
      propDefinition: [
        kustomer,
        "assignedUsers",
      ],
      optional: true,
    },
    assignedTeams: {
      propDefinition: [
        kustomer,
        "assignedTeams",
      ],
      optional: true,
    },
    defaultLang: {
      type: "string",
      label: "Default Language",
      description: "Default language for the conversation",
      optional: true,
    },
    queue: {
      type: "string",
      label: "Queue",
      description: "Queue information",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.kustomer.createConversation({
      customerId: this.customerId,
      externalId: this.externalId,
      name: this.name,
      status: this.status,
      priority: this.priority,
      direction: this.direction,
      replyChannel: this.replyChannel,
      tags: this.tags,
      assignedUsers: this.assignedUsers,
      assignedTeams: this.assignedTeams,
      defaultLang: this.defaultLang,
      queue: this.queue,
    });

    $.export("$summary", `Created conversation with ID ${response.id}`);
    return response;
  },
};
