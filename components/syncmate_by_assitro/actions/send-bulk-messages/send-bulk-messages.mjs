import syncmateByAssitro from "../../syncmate_by_assitro.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "syncmate_by_assitro-send-bulk-messages",
  name: "Send Bulk Messages",
  description: "Send multiple WhatsApp messages in bulk. [See the documentation](https://assistro.co/user-guide/bulk-messaging-at-a-scheduled-time-using-syncmate-2/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    syncmateByAssitro,
    numberOfMessages: {
      propDefinition: [
        syncmateByAssitro,
        "numberOfMessages",
      ],
    },
    number: {
      propDefinition: [
        syncmateByAssitro,
        "number",
      ],
    },
    message: {
      propDefinition: [
        syncmateByAssitro,
        "message",
      ],
    },
    media: {
      propDefinition: [
        syncmateByAssitro,
        "media",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.syncmateByAssitro.sendBulkMessages({
      numberOfMessages: this.numberOfMessages,
      number: this.number,
      message: this.message,
      media: this.media,
    });

    $.export("$summary", `Successfully sent ${this.numberOfMessages} messages to ${this.number}`);
    return response;
  },
};
