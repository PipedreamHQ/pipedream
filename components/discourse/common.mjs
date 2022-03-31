import crypto from "crypto";
import discourse from "./discourse.app.mjs";
import isEmpty from "lodash.isempty";

export default {
  props: {
    http: "$.interface.http",
    db: "$.service.db",
    discourse,
  },
  dedupe: "unique",
  hooks: {
    async deactivate() {
      const hookID = this.db.get("hookID");
      await this.discourse.deleteHook({
        hookID,
      });
    },
  },
  methods: {
    // Generic activate method used in component-specific hooks
    async activate(webhookPayload) {
      const secret = this.discourse.generateSecret();
      this.db.set("secret", secret);
      const { id } = await this.discourse.createHook({
        endpoint: this.http.endpoint,
        secret,
        ...webhookPayload,
      });
      this.db.set("hookID", id);
    },
    verifySignature(header, body) {
      const algo = "sha256";
      const hmac = crypto.createHmac(algo, this.db.get("secret"));
      hmac.update(JSON.stringify(body), "utf-8");
      if (header !== `${algo}=${hmac.digest("hex")}`) {
        throw new Error(
          "Discourse signature does not match computed signature",
        );
      }
    },
    generateMeta() {
      throw new Error("Generate meta is not implemented");
    },
    validateEventAndEmit(event, eventName, key) {
      const {
        body,
        headers,
      } = event;
      if (isEmpty(headers) || !headers["x-discourse-event-signature"]) {
        throw new Error("Discourse signature header not present. Exiting");
      }

      this.verifySignature(headers["x-discourse-event-signature"], body);

      if (headers["x-discourse-event"] !== eventName) {
        console.log(`Not a ${eventName} event. Exiting`);
        return;
      }

      const data = body[key];
      this.$emit(data, this.generateMeta(data));
    },
  },
};
