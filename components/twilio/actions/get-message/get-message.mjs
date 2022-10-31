import twilio from "../../twilio.app.mjs";
import { messageToString } from "../../common/utils.mjs";

export default {
  key: "twilio-get-message",
  name: "Get Message",
  description: "Return details of a message. [See the docs](https://www.twilio.com/docs/sms/api/message-resource#fetch-a-message-resource) for more information",
  version: "0.1.1",
  type: "action",
  props: {
    twilio,
    messageId: {
      propDefinition: [
        twilio,
        "messageId",
      ],
    },
  },
  async run({ $ }) {
    const resp = await this.twilio.getMessage(this.messageId);
    $.export("$summary", `Successfully fetched the message, "${messageToString(resp)}"`);
    return resp;
  },
};
