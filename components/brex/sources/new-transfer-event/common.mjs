import axios from "axios";
import crypto from "crypto";

export default {
  props: {
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    events: {
      type: "string[]",
      label: "Events",
      description: "Please specify the events you want to watch with this source.",
      options: [
        "TRANSFER_PROCESSED",
        "TRANSFER_FAILED",
      ],
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
          event_types: this.events,
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
      for (let i = 0; i < secrets.length; i++) {
        const signedContent = `${webhookId}.${webhookTimestamp}.${webhookBody}`;
        const base64DecodedSecret = Buffer.from(secrets[i], "base64");
        const hmac = crypto.createHmac("sha256", base64DecodedSecret);
        const computedSignature = hmac.update(signedContent).digest("base64");
        if (computedSignature === webhookSignature) {
          return;
        }
      }

      throw new Error("The received request is not trustable. The computed signature does not match with the hook signature. THe request was aborted.");
    },
    async getTransactionDetails(transactionId) {
      const res = await axios(this.brexApp._getAxiosParams({
        method: "GET",
        path: `/v1/transfers/${transactionId}`,
      }));
      return res.data;
    },
    _emit(data) {
      this.$emit(data, {
        id: data.details.id,
        summary: data.details.id,
        ts: new Date(),
      });
    },
    _setHookId(id) {
      this.db.set("hookId", id);
    },
    _getHookId() {
      return this.db.get("hookId");
    },
  },
  async run(event) {
    if (
      !event.headers ||
      !event.headers["webhook-signature"] ||
      !event.headers["webhook-id"] ||
      !event.headers["webhook-timestamp"]
    ) {
      throw new Error("The received request is not trustable, some header(s) is missing. The request was aborted.");
    }
    const keys = await this.getSecretKeys();
    const signatures = event.headers["webhook-signature"].split(" ");
    for (let i = 0; i < signatures.length; i++) {
      this.checkVeracity(
        signatures[i].split(",")[1],
        event.headers["webhook-id"],
        event.headers["webhook-timestamp"],
        event.bodyRaw,
        keys,
      );
    }

    const transaction = await this.getTransactionDetails(event.body.transfer_id);
    this._emit({
      ...event.body,
      details: transaction,
    });

    this.http.respond({
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
