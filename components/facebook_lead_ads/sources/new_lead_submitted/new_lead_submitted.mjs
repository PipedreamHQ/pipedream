import app from "../../facebook_lead_ads.app.mjs";
import crypto from "crypto";
import { v4 as uuid } from "uuid";

export default {
  dedupe: "unique",
  type: "source",
  key: "facebook_lead_ads-new_lead_submitted",
  name: "New Lead Submitted",
  description: "Emit new Event when a lead is submitted. [See the documentation](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/setup)",
  version: "0.0.1",
  props: {
    app,
    http: "$.interface.http",
    appSecret: {
      type: "string",
      label: "App Secret",
      description: "The App Secret from your Facebook App. To get your secret, access your [Facebook Apps page](https://developers.facebook.com/apps), select your App, then go to `Settings > Basic > App Secret`",
    },
  },
  methods: {
    isSha1SignatureValid(body, signature) {
      const expectedHash = crypto.createHmac("sha1", this.appSecret)
        .update(body)
        .digest("hex");
      return `sha1=${expectedHash}` === signature;
    },
    emit(event) {
      const date = new Date();
      this.$emit(event, {
        summary: `New Lead (${date.toLocaleString()})`,
        id: uuid(),
        ts: date.getTime(),
      });
    },
  },
  async run(event) {
    if (event.query["hub.mode"] === "subscribe") {
      console.log("Webhook successfully subscribed");
      return;
    }

    if (!this.isSha1SignatureValid(event.bodyRaw, event.headers["x-hub-signature"])) {
      throw new Error("Invalid signature");
    }

    this.emit(event);
  },
};
