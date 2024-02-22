import { axios } from "@pipedream/platform";
import elksApp from "../../46elks.app.mjs";

export default {
  key: "46elks-send-sms",
  name: "Send SMS",
  description: "Composes and sends an SMS message to a specified phone number. [See the documentation](https://46elks.com/docs/send-sms)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    elksApp,
    from: {
      propDefinition: [
        elksApp,
        "from",
      ],
    },
    to: {
      propDefinition: [
        elksApp,
        "to",
      ],
    },
    message: {
      propDefinition: [
        elksApp,
        "message",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.elksApp.sendSms({
      from: this.from,
      to: this.to,
      message: this.message,
    });

    $.export("$summary", `Sent SMS message from ${this.from} to ${this.to}`);
    return response;
  },
};
