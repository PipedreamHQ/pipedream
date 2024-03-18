import clicksend from "../../clicksend.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "clicksend-send-mms",
  name: "Send MMS",
  description: "Sends a new MMS to one or multiple recipients. [See the documentation](https://developers.clicksend.com/docs/rest/v3/#send-mms)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    clicksend,
    recipientNumber: {
      propDefinition: [
        clicksend,
        "recipientNumber",
      ],
    },
    fileUrl: {
      propDefinition: [
        clicksend,
        "fileUrl",
      ],
    },
    message: {
      propDefinition: [
        clicksend,
        "message",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.clicksend.sendMms({
      recipientNumber: this.recipientNumber,
      fileUrl: this.fileUrl,
      message: this.message || "",
    });

    $.export("$summary", `Sent MMS to ${this.recipientNumber}`);
    return response;
  },
};
