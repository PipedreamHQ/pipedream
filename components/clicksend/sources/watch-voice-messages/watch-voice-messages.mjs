import clicksend from "../../clicksend.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "clicksend-watch-voice-messages",
  name: "Watch Voice Messages",
  description: "Emit new event when a new voice message is received or sent. [See the documentation](https://developers.clicksend.com/docs/rest/v3/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    clicksend,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    recipientNumber: {
      propDefinition: [
        clicksend,
        "recipientNumber",
      ],
    },
    lengthOfVoiceMessage: {
      propDefinition: [
        clicksend,
        "lengthOfVoiceMessage",
      ],
    },
    audioMessageFile: {
      propDefinition: [
        clicksend,
        "audioMessageFile",
      ],
    },
  },
  hooks: {
    async deploy() {
      const lastFiftyMessages = await this.clicksend.getVoiceMessages({
        limit: 50,
        sort: "desc",
      });
      lastFiftyMessages.forEach((message) => {
        this.$emit(message, {
          id: message.message_id,
          summary: `Received voice message from ${message.from}`,
          ts: Date.parse(message.date),
        });
      });
    },
    async activate() {
      // Since ClickSend does not support webhooks for voice messages, there's no need to create a webhook here.
    },
    async deactivate() {
      // Since ClickSend does not support webhooks for voice messages, there's no need to delete a webhook here.
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Compute signature to validate incoming messages
    const signature = headers["x-clicksend-signature"];
    const computedSignature = crypto.createHmac("sha256", this.clicksend.$auth.api_secret)
      .update(JSON.stringify(body))
      .digest("hex");

    if (signature !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    // Emit the event for the new voice message
    this.$emit(body, {
      id: body.message_id || `${Date.now()}`,
      summary: `New voice message from ${body.from}`,
      ts: body.date
        ? Date.parse(body.date)
        : Date.now(),
    });

    // Respond to the HTTP request
    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
