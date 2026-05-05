import freshchat from "../../freshchat.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "freshchat-update-conversation-status",
  name: "Update Conversation",
  description: "Updates a conversation's status, assignment, or properties. [See the documentation](https://developers.freshchat.com/api/#update_a_conversation)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    freshchat,
    userId: {
      propDefinition: [
        freshchat,
        "userId",
      ],
    },
    conversationId: {
      propDefinition: [
        freshchat,
        "conversationId",
        (c) => ({
          userId: c.userId,
        }),
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the conversation",
      options: [
        "new",
        "assigned",
        "resolved",
        "reopened",
      ],
    },
    agentId: {
      propDefinition: [
        freshchat,
        "agentId",
      ],
      description: "The ID of an agent to assign the conversation to. Required if status is `assigned`. Pass empty string to unassign.",
      optional: true,
    },
    groupId: {
      propDefinition: [
        freshchat,
        "groupId",
      ],
      description: "The ID of a group to assign the conversation to. Pass empty string to unassign.",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "Priority level of the conversation",
      options: [
        "Low",
        "Medium",
        "High",
        "Urgent",
      ],
      optional: true,
    },
    customProperties: {
      type: "object",
      label: "Custom Properties",
      description: "Custom conversation properties as key-value pairs. Keys should be prefixed with `cf_`. Example: `{\"cf_department\": \"Sales\", \"cf_region\": \"West\"}`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.status === "assigned" && !this.agentId) {
      throw new ConfigurationError("Agent ID is required when status is `assigned`");
    }

    const data = {};

    // Only include fields that are set
    if (this.status) data.status = this.status;
    if (this.agentId !== undefined) data.assigned_agent_id = this.agentId || "";
    if (this.groupId !== undefined) data.assigned_group_id = this.groupId || "";

    // Build properties object
    const properties = {};
    if (this.priority) properties.priority = this.priority;
    if (this.customProperties) {
      Object.assign(properties, parseObject(this.customProperties));
    }
    if (Object.keys(properties).length > 0) {
      data.properties = properties;
    }

    const response = await this.freshchat.updateConversation({
      $,
      conversationId: this.conversationId,
      data,
    });

    const updates = [];
    if (this.status) updates.push(`status to ${this.status}`);
    if (this.agentId !== undefined) {
      updates.push(this.agentId
        ? "agent assignment"
        : "unassigned agent");
    }
    if (this.groupId !== undefined) {
      updates.push(this.groupId
        ? "group assignment"
        : "unassigned group");
    }
    if (this.priority) updates.push(`priority to ${this.priority}`);
    if (this.customProperties) updates.push("custom properties");

    $.export("$summary", `Updated conversation: ${updates.join(", ")}`);
    return response;
  },
};
