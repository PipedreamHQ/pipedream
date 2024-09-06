import krispcall from "../../krispcall.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "krispcall-new-sms",
  name: "Send New SMS",
  description: "Send a new SMS to a number. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    krispcall,
    fromNumber: {
      propDefinition: [
        krispcall,
        "fromNumber",
      ],
    },
    toNumber: {
      propDefinition: [
        krispcall,
        "toNumber",
      ],
    },
    content: {
      propDefinition: [
        krispcall,
        "content",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.krispcall.sendSMS({
      fromNumber: this.fromNumber,
      toNumber: this.toNumber,
      content: this.content,
    });

    $.export("$summary", `SMS sent successfully to ${this.toNumber}`);
    return response;
  },
};
