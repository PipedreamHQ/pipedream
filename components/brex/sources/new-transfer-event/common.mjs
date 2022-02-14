import axios from "axios";
import crypto from "crypto";

export default {
  props: {
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      await this.unregisterHook();
      const res = await axios(this.brexApp._getAxiosParams({
        method: "POST",
        path: "/v1/webhooks",
        data: {
          url: this.http.endpoint,
          event_types: [
            "TRANSFER_PROCESSED",
            "TRANSFER_FAILED",
            "REFERRAL_CREATED",
            "REFERRAL_ACTIVATED",
            "REFERRAL_APPLICATION_STATUS_CHANGED",
          ],
        },
      }));

      if (!res.data?.id) {
        throw new Error("It was not possible to register the webhook. Please try again or contact the support");
      }

      this._setHookId(res.data.id);

      console.log(`Hook successfully registered with id ${res.data.id}`);
    },
    async deactivate() {
      await this.unregisterHook();
    },
  },
  methods: {
    async unregisterHook() {
      const hookId = this._getHookId();
      if (!hookId) {
        return;
      }
      await axios(this.brexApp._getAxiosParams({
        method: "DELETE",
        path: `/v1/webhooks/${this._getHookId()}`,
      }));
      this._setHookId(null);
      console.log("Hook successfully unregistered");
    },
    async getSecretKeys() {
      // Get secrets from Brex
      const res = await axios(this.brexApp._getAxiosParams({
        method: "GET",
        path: "/v1/webhooks/secrets",
      }));

      if (res.data?.length === 0) {
        throw new Error("It was not possible to verify the veracity of this request.");
      }

      return res.data.map((key) => key.secret);
    },
    checkVeracity(webhookSignature, webhookId, webhookTimestamp, webhookBody, secrets) {
      if (!webhookSignature || !webhookId || !webhookTimestamp || !webhookBody) {
        throw new Error("The received request is not trustable, some header(s) is missing. The request was aborted.");
      }
      for (let i = 0; i < secrets.length; i++) {
        const signedContent = `${webhookId}.${webhookTimestamp}.${webhookBody}`;
        const base64DecodedSecret = Buffer.from(secrets[i], "base64");
        const hmac = crypto.createHmac("sha256", base64DecodedSecret);
        const computedSignature = hmac.update(signedContent).digest();
        if (computedSignature !== webhookSignature) {
          throw new Error("The received request is not trustable. The computed signature does not match with the hook signature. THe request was aborted.");
        }
      }
    },
    processEvents(events) {
      // TODO
      console.log(events);
    },
    _emit() {
      // TODO
    },
    _setHookId(id) {
      this.db.set("hookId", id);
    },
    _getHookId() {
      return this.db.get("hookId");
    },
  },
  async run(event) {
    const keys = await this.getSecretKeys();
    console.log({
      event,
      keys,
    });
    this.http.respond({
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
