import notion from "../../notion.app.mjs";
import {
  createHmac, timingSafeEqual,
} from "crypto";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    notion,
    db: "$.service.db",
    http: "$.interface.http",
    info: {
      type: "alert",
      alertType: "info",
      content: `1. Create this Pipedream source and copy the Source Endpoint URL.
2. In Notion, create a webhook subscription and paste the Source Endpoint URL as the webhook URL. See Notion's guide: https://developers.notion.com/reference/webhooks#step-1-creating-a-webhook-subscription
3. After adding the subscription in Notion, you'll be prompted to verify the webhook using a secret. Open the Source Logs tab in this Pipedream source to find the verification secret (token) and enter it in Notion to complete verification.`,
    },
  },
  methods: {
    _getToken() {
      return this.db.get("token");
    },
    _setToken(token) {
      this.db.set("token", token);
    },
    verifyWebhook(token, body, headers) {
      const calculatedSignature = `sha256=${createHmac("sha256", token).update(JSON.stringify(body))
        .digest("hex")}`;
      return timingSafeEqual(
        Buffer.from(calculatedSignature),
        Buffer.from(headers["x-notion-signature"]),
      );
    },
    processEvent() {
      throw new ConfigurationError("processEvent must be implemented in the source");
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (!body) {
      return;
    }
    const token = this._getToken();
    if (body.verification_token && !token) {
      this._setToken(body.verification_token);
      console.log(`Verification token: ${body.verification_token}. Enter this in your Notion webhook settings.`);
      return;
    }
    if (!this.verifyWebhook(token, body, headers)) {
      throw new Error("Invalid webhook signature");
    }

    await this.processEvent(body);
  },
};
