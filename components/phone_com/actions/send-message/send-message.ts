import phone_com from "../../app/phone_com.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Send Message",
  description: "Send a message via Phone.com [See docs here](https://apidocs.phone.com/reference/post_v4-accounts-voip-id-messages)",
  key: "phone_com-send-message",
  version: "0.0.1",
  type: "action",
  props: {
    phone_com,
    account: {
      propDefinition: [
        phone_com,
        "account"
      ]
    },
    fromNumber: {
      type: "string",
      label: "Sender Number",
      description: "Sender's phone number must be Phone.com's."
    },
    toNumber: {
      type: "string[]",
      label: "Recipient Number(s)",
      description: "List of phone numbers to send the message to."
    },
    text: {
      type: "string",
      label: "Text",
      description: "The message text."
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "Client-side tracking identifier."
    }
  },
  async run({ $ }) {
    const result = await this.phone_com.sendMessage({
      from: this.fromNumber,
      to: this.toNumber,
      text: this.text,
      tag: this.tag,
    });
    
    $.export("$summary", "Sent message successfully");
    return result;
  },
});
