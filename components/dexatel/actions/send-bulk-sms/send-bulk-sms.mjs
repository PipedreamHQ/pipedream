import dexatel from "../../dexatel.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dexatel-send-bulk-sms",
  name: "Send Bulk SMS",
  description: "Facilitates sending of SMS messages in bulk to specified phone numbers. [See the documentation](https://dexatel.com/developers/messages-add/)",
  version: "0.0.1",
  type: "action",
  props: {
    dexatel,
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
  },
  async run({ $ }) {
    const response = await this.dexatel.sendBulkMessages({
      recipientNumbers: this.recipientNumbers,
      messageContent: this.messageContent,
    });
    $.export("$summary", `Successfully sent ${this.recipientNumbers.length} messages`);
    return response;
  },
};
