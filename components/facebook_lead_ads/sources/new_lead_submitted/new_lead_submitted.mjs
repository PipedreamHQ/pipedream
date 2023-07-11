import app from "../../facebook_lead_ads.app.mjs";
import crypto from "crypto";
import { v4 as uuid } from "uuid";

export default {
  dedupe: "unique",
  type: "source",
  key: "facebook_lead_ads-new_lead_submitted",
  name: "New Lead Submitted",
  description: "Emit new event when a new playlist is created or followed by the current Spotify user.",
  version: "0.0.1",
  props: {
    app,
    http: "$.interface.http",
    appSecret: {
      type: "string",
      label: "App Secret",
      description: "The App Secret from your Facebook App. To get your secret, open your Facebook App and (Go to Settings > Basic > App Secret)",
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
