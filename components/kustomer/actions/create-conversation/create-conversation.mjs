import {
  parseObject, throwError,
} from "../../common/utils.mjs";
import kustomer from "../../kustomer.app.mjs";

export default {
  key: "kustomer-create-conversation",
  name: "Create Conversation",
  description: "Creates a new conversation in Kustomer. [See the documentation](https://developer.kustomer.com/kustomer-api-docs/reference/createaconversation)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    kustomer,
    customer: {
      propDefinition: [
        kustomer,
        "customerId",
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
    },
  },
  async run({ $ }) {
    try {
      const response = await this.kustomer.createConversation({
        $,
        data: {
          customer: this.customer,
          externalId: this.externalId,
          name: this.name,
          status: this.status,
          priority: this.priority,
          direction: this.direction,
          tags: parseObject(this.tags),
          assignedUsers: parseObject(this.assignedUsers),
          assignedTeams: parseObject(this.assignedTeams),
          defaultLang: this.defaultLang,
          queue: {
            id: this.queueId,
          },
        },
      });

      $.export("$summary", `Created conversation with ID ${response.data.id}`);
      return response;
    } catch ({ message }) {
      throwError(message);
    }
  },
};
