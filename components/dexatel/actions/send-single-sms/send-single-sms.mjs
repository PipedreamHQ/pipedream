import dexatel from "../../dexatel.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dexatel-send-single-sms",
  name: "Send Single SMS",
  description: "Sends a single SMS to a specified recipient. [See the documentation](https://dexatel.com/developers/messages-add)",
  version: "0.0.1",
  type: "action",
  props: {
    dexatel,
    recipientNumber: dexatel.propDefinitions.recipientNumber,
    messageContent: dexatel.propDefinitions.messageContent,
  },
  async run({ $ }) {
    const response = await this.dexatel.sendMessage({
      recipientNumber: this.recipientNumber,
      messageContent: this.messageContent,
    });
    $.export("$summary", `Successfully sent message to ${this.recipientNumber}`);
    return response;
  },
};
