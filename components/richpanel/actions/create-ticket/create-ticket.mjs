import { ConfigurationError } from "@pipedream/platform";
import { VIA_CHANNEL_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import richpanel from "../../richpanel.app.mjs";

export default {
  key: "richpanel-create-ticket",
  name: "Create Ticket",
  description: "Creates a new support ticket in Richpanel. [See the documentation](https://developer.richpanel.com/reference/create-conversation).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the ticket.",
      optional: true,
    },
    commentBody: {
      propDefinition: [
        richpanel,
        "commentBody",
      ],
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority of the ticket.",
      options: [
        "HIGH",
        "LOW",
      ],
      optional: true,
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
      description: "The channel via which the ticket is created.",
      reloadProps: true,
      options: VIA_CHANNEL_OPTIONS,
    },
    viaSourceFromAddress: {
      type: "string",
      label: "Via Source From Address",
      description: "The email address of the source from.",
      hidden: true,
    },
    viaSourceFromName: {
      type: "string",
      label: "Via Source From Name",
      description: "The name of the source from.",
      hidden: true,
    },
    viaSourceToAddress: {
      type: "string",
      label: "Via Source To Address",
      description: "The email address of the source to.",
      hidden: true,
    },
    viaSourceToName: {
      type: "string",
      label: "Via Source To Name",
      description: "The name of the source to.",
      hidden: true,
    },
    viaSourceFromNumber: {
      type: "string",
      label: "Via Source From Number",
      description: "The phone number of the source from.",
      hidden: true,
    },
    viaSourceToNumber: {
      type: "string",
      label: "Via Source To Number",
      description: "The phone number of the source to.",
      hidden: true,
    },
    viaSourceFrom: {
      type: "object",
      label: "Via Source From",
      description: "The object source from which the ticket was created. **Examples: {\"address\": \"abc@email.com\"} or {\"id\": \"+16692668044\"}. It depends on the selected channel**.",
      hidden: true,
    },
    viaSourceTo: {
      type: "object",
      label: "Via Source To",
      description: "The object source to which the ticket was created. **Examples: {\"address\": \"abc@email.com\"} or {\"id\": \"+16692668044\"}. It depends on the selected channel**.",
      hidden: true,
    },
    tags: {
      propDefinition: [
        richpanel,
        "tags",
      ],
      optional: true,
    },
  },
  async additionalProps(props) {
    switch (this.viaChannel) {
    case "email" :
      props.viaSourceFromAddress.hidden = false;
      props.viaSourceFromName.hidden = false;
      props.viaSourceToAddress.hidden = false;
      props.viaSourceToName.hidden = false;
      props.viaSourceFrom.hidden = true;
      props.viaSourceTo.hidden = true;
      props.viaSourceFromNumber.hidden = true;
      props.viaSourceToNumber.hidden = true;
      break;
    case "aircall" :
      props.viaSourceFromNumber.hidden = false;
      props.viaSourceToNumber.hidden = false;
      props.viaSourceFrom.hidden = true;
      props.viaSourceTo.hidden = true;
      props.viaSourceFromAddress.hidden = true;
      props.viaSourceFromName.hidden = true;
      props.viaSourceToAddress.hidden = true;
      props.viaSourceToName.hidden = true;
      break;
    default:
      props.viaSourceFrom.hidden = false;
      props.viaSourceTo.hidden = false;
      props.viaSourceFromAddress.hidden = true;
      props.viaSourceFromName.hidden = true;
      props.viaSourceToAddress.hidden = true;
      props.viaSourceToName.hidden = true;
      props.viaSourceFromNumber.hidden = true;
      props.viaSourceToNumber.hidden = true;
    }
    return {};
  },
  async run({ $ }) {
    try {
      const source = {};
      switch (this.viaChannel) {
      case "email" :
        source.from = {
          address: this.viaSourceFromAddress,
          name: this.viaSourceFromName,
        };
        source.to = {
          address: this.viaSourceToAddress,
          name: this.viaSourceToName,
        };
        break;
      case "aircall" :
        source.from = {
          id: this.viaSourceFromNumber,
        };
        source.to = {
          id: this.viaSourceToNumber,
        };
        break;
      default:
        source.from = parseObject(this.viaSourceFrom);
        source.to = parseObject(this.viaSourceTo);
      }

      const response = await this.richpanel.createTicket({
        $,
        data: {
          ticket: {
            id: this.id,
            status: this.status,
            subject: this.subject,
            comment: {
              body: this.commentBody,
              sender_type: this.commentSenderType,
            },
            priority: this.priority,
            via: {
              channel: this.viaChannel,
              source,
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
