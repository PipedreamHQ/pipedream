import { parseObject } from "../../common/utils.mjs";
import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-send-bulk-email",
  name: "Send Bulk Email",
  description: "Send eGifts to multiple recipients. [See the documentation](https://developer.sendoso.com/rest-api/sends/send-bulk-email)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sendoso,
    touchId: {
      propDefinition: [
        sendoso,
        "touchId",
      ],
    },
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "List of email addresses to send to.",
    },
  },
  async run({ $ }) {
    const response = await this.sendoso.sendBulkEmail({
      $,
      touch_id: this.touchId,
      emails: parseObject(this.recipients),
    });
    $.export("$summary", `Successfully initiated bulk send to ${this.recipients.length} recipients`);
    return response;
  },
};
