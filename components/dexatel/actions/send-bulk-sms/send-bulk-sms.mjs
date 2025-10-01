import { parseArray } from "../../common/utils.mjs";
import dexatel from "../../dexatel.app.mjs";

export default {
  key: "dexatel-send-bulk-sms",
  name: "Send Bulk SMS",
  description: "Facilitates sending of SMS messages in bulk to specified phone numbers. [See the documentation](https://dexatel.com/developers/messages-add/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dexatel,
    senderId: {
      propDefinition: [
        dexatel,
        "senderId",
      ],
    },
    recipientNumbers: {
      propDefinition: [
        dexatel,
        "recipientNumbers",
      ],
    },
    messageContent: {
      propDefinition: [
        dexatel,
        "messageContent",
      ],
    },
    templateId: {
      propDefinition: [
        dexatel,
        "templateId",
      ],
      optional: true,
    },
    variables: {
      type: "string[]",
      label: "Variables",
      description: "List of the template values",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dexatel.sendMessage({
      $,
      data: {
        data: {
          from: this.senderId,
          to: this.recipientNumbers && parseArray(this.recipientNumbers),
          text: this.messageContent,
          channel: "SMS",
          template: this.templateId,
          variables: this.variables,
        },
      },
    });
    $.export("$summary", `Successfully sent ${this.recipientNumbers.length} messages`);
    return response;
  },
};
