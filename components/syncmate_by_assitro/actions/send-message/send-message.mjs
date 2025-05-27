import syncmateByAssitro from "../../syncmate_by_assitro.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "syncmate_by_assitro-send-message",
  name: "Send WhatsApp Message",
  description: "Send a single WhatsApp message using SyncMate by Assistro. [See the documentation](https://assistro.co/user-guide/connect-your-custom-app-with-syncmate/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    syncmateByAssitro,
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
    },
  },
  async run({ $ }) {
    const response = await this.syncmateByAssitro.sendSingleMessage({
      number: this.number,
      message: this.message,
      media: this.media,
    });

    $.export("$summary", `Successfully sent message to ${this.number}`);
    return response;
  },
};
