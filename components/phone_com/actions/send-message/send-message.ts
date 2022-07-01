import phone_com from "../../app/phone_com.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Send Message",
  description: "Send a message via Phone.com [See docs](https://apidocs.phone.com/reference/post_v4-accounts-voip-id-messages)",
  key: "phone_com-send-message",
  version: "0.0.1",
  type: "action",
  props: {
    phone_com,
  },
  async run({ $ }) {
    const auth = this.phone_com._getAuth();
    $.export("$summary", "Sent message successfully");
    return {
      auth,
      success: true
    };
  },
});
