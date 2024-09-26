import app from "../../intercom.app.mjs";
import { v4 as uuid } from "uuid";
import crypto from "crypto";

export default {
  key: "intercom-new-topic",
  name: "New Topic (Instant)",
  description: "Emit new event for each new topic that you subscribed in your webhook. [See more here](https://developers.intercom.com/building-apps/docs/setting-up-webhooks).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    http: "$.interface.http",
    clientSecret: {
      type: "string",
      label: "Client Secret",
      description: "**Highly recommended**. The client secret for your Intercom app. The client secret can be found in your app basic information page. [See more here](https://developers.intercom.com/building-apps/docs/setting-up-webhooks).",
      optional: true,
    },
  },
  methods: {
    isSignatureValid(body, signature) {
      if (!signature) {
        throw new Error("Signature is missing in the request header. Skipping event...");
      }
      const hmac = crypto.createHmac("sha1", this.clientSecret);
      hmac.update(body);
      const digest = hmac.digest("hex");
      return `sha1=${digest}` === signature;
    },
    emit(body) {
      const id = body.data?.item.id ?? body.data?.item.external_id;
      const eventType = body.data?.item.type ?? body.type ?? "notification_event";
      this.$emit(body, {
        id: id ?? uuid(),
        summary: `${eventType} - id: ${id ?? "(no id found)"}}`,
        ts: new Date().getTime(),
      });
    },
  },
  async run(event) {
    if (this.clientSecret && !this.isSignatureValid(event.bodyRaw, event.headers["x-hub-signature"])) {
      throw new Error("Signature is not valid. Skipping event...");
    }
    this.emit(event.body);
  },
};
