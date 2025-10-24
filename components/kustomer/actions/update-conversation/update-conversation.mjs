import {
  parseObject, throwError,
} from "../../common/utils.mjs";
import kustomer from "../../kustomer.app.mjs";

export default {
  key: "kustomer-update-conversation",
  name: "Update Conversation",
  description: "Updates an existing conversation in Kustomer. [See the documentation](https://developer.kustomer.com/kustomer-api-docs/reference/updateconversation).",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    kustomer,
    conversationId: {
      propDefinition: [
        kustomer,
        "conversationId",
      ],
    },
    externalId: {
      propDefinition: [
        kustomer,
        "externalId",
      ],
      optional: true,
    },
    name: {
      propDefinition: [
        kustomer,
        "name",
      ],
      description: "Name of the conversation",
      optional: true,
    },
    status: {
      propDefinition: [
        kustomer,
        "status",
      ],
      optional: true,
    },
    priority: {
      propDefinition: [
        kustomer,
        "priority",
      ],
      optional: true,
    },
    direction: {
      propDefinition: [
        kustomer,
        "direction",
      ],
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
      propDefinition: [
        kustomer,
        "defaultLang",
      ],
      description: "Default language for the conversation",
      optional: true,
    },
    queueId: {
      propDefinition: [
        kustomer,
        "queueId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.kustomer.updateConversation({
        $,
        conversationId: this.conversationId,
        data: {
          externalId: this.externalId,
          name: this.name,
          status: this.status,
          priority: this.priority,
          direction: this.direction,
          tags: parseObject(this.tags),
          assignedUsers: parseObject(this.assignedUsers),
          assignedTeams: parseObject(this.assignedTeams),
          defaultLang: this.defaultLang,
          queue: this.queueId,
        },
      });

      $.export("$summary", `Conversation ${this.conversationId} updated successfully`);
      return response;
    } catch ({ message }) {
      throwError(message);
    }
  },
};
