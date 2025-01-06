import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import richpanel from "../../richpanel.app.mjs";
import { VIA_CHANNEL_OPTIONS } from "./common/constants.mjs";

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
      type: "string",
      label: "Via Channel",
      description: "The channel via which the ticket is created",
      options: VIA_CHANNEL_OPTIONS,
    },
    viaSourceFrom: {
      type: "object",
      label: "Via Source From",
      description: "The object source from which the ticket was created. **Examples: {\"address\": \"abc@email.com\"} or {\"id\": \"+16692668044\"}. It depends on the selected channel**.",
    },
    viaSourceTo: {
      type: "object",
      label: "Via Source To",
      description: "The object source to which the ticket was created. **Examples: {\"address\": \"abc@email.com\"} or {\"id\": \"+16692668044\"}. It depends on the selected channel**.",
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
