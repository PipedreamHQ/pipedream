import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import richpanel from "../../richpanel.app.mjs";

export default {
  key: "richpanel-create-ticket",
  name: "Create Ticket",
  description: "Creates a new support ticket in Richpanel. [See the documentation](https://developer.richpanel.com/reference/create-conversation).",
  version: "0.0.1",
  type: "action",
  props: {
    richpanel,
    id: {
      propDefinition: [
        richpanel,
        "createId",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        richpanel,
        "status",
      ],
    },
    commentBody: {
      propDefinition: [
        richpanel,
        "commentBody",
      ],
    },
    commentSenderType: {
      propDefinition: [
        richpanel,
        "commentSenderType",
      ],
    },
    viaChannel: {
      propDefinition: [
        richpanel,
        "viaChannel",
      ],
    },
    viaSourceFrom: {
      propDefinition: [
        richpanel,
        "viaSourceFrom",
      ],
    },
    viaSourceTo: {
      propDefinition: [
        richpanel,
        "viaSourceTo",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        richpanel,
        "tags",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.richpanel.createTicket({
        $,
        data: {
          ticket: {
            id: this.id,
            status: this.status,
            comment: {
              body: this.commentBody,
              sender_type: this.commentSenderType,
            },
            via: {
              channel: this.viaChannel,
              source: {
                from: parseObject(this.viaSourceFrom),
                to: parseObject(this.viaSourceTo),
              },
            },
            tags: parseObject(this.tags),
          },
        },
      });

      $.export("$summary", `Created ticket ${response.ticket.id}`);
      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response?.data?.error?.message);
    }
  },
};
