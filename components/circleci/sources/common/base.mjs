import circleci from "../../circleci.app.mjs";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export default {
  props: {
    circleci,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    name: {
      type: "string",
      label: "Webhook Name",
      description: "Name of the webhook",
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The identifier of a project. Can be found in Project Settings -> Overview",
    },
  },
  hooks: {
    async activate() {
      const secret = uuidv4();
      const { id } = await this.circleci.createWebhook({
        data: {
          "name": this.name,
          "events": this.getEvents(),
          "url": this.http.endpoint,
          "verify-tls": true,
          "signing-secret": secret,
          "scope": {
            "id": this.projectId,
            "type": "project",
          },
        },
      });
      this._setHookId(id);
      this._setSigningSecret(secret);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      if (webhookId) {
        await this.circleci.deleteWebhook(webhookId);
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    _getSigningSecret() {
      return this.db.get("signingSecret");
    },
    _setSigningSecret(secret) {
      this.db.set("signingSecret", secret);
    },
    verifySignature({
      headers, body,
    }) {
      if (!headers["circleci-signature"]) {
        return false;
      }
      const secret = this._getSigningSecret();
      const signatureFromHeader = headers["circleci-signature"]
        .split(",")
        .reduce((acc, pair) => {
          const [
            key,
            value,
          ] = pair.split("=");
          acc[key] = value;
          return acc;
        }, {}).v1;

      const validSignature = crypto
        .createHmac("sha256", secret)
        .update(JSON.stringify(body), "utf8")
        .digest("hex");

      return crypto.timingSafeEqual(
        Buffer.from(validSignature, "hex"),
        Buffer.from(signatureFromHeader, "hex"),
      );
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: this.getSummary(event),
        ts: Date.parse(event.happened_at),
      };
    },
    getEvents() {
      throw new Error("getEvents is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    if (!this.verifySignature(event)) {
      console.log("Invalid webhook signature");
      return;
    }

    const { body } = event;
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
