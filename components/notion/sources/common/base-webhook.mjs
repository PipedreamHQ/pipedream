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
      content: "Webhooks must be created and verified in Notion. [See the documentation](https://developers.notion.com/reference/webhooks#step-1-creating-a-webhook-subscription). Upon webhook creation, the source logs will display a verification token. Enter this in your Notion webhook settings.",
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
