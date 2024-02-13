import dopplerai from "../../dopplerai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dopplerai-send-message",
  name: "Send Message",
  description: "Dispatches a message to the artificial intelligence. [See the documentation](https://api.dopplerai.com/docs/reference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dopplerai,
    messageText: {
      propDefinition: [
        dopplerai,
        "messageText",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dopplerai.dispatchMessage(this.messageText);
    $.export("$summary", `Successfully sent message: ${this.messageText}`);
    return response;
  },
};
