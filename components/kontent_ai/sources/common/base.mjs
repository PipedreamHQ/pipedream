import { signatureHelper } from "@kontent-ai/webhook-helper";
import crypto from "crypto";
import kontentAi from "../../kontent_ai.app.mjs";

export default {
  dedupe: "unique",
  props: {
    kontentAi,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const uuid = crypto.randomUUID();
      const { data } = await this.kontentAi.createHook({
        name: this.getWebhookName(uuid),
        url: this.http.endpoint,
        secret: uuid,
        triggers: this.getTriggers(),
      });

      this._setUUID(uuid);
      this._setHookId(data.id);
    },
    async deactivate() {
      const id = this._getHookId("hookId");
      await this.kontentAi.deleteHook(id);
    },
  },
  methods: {
    emitEvent(body) {
      const meta = this.generateMeta(body.message);
      this.$emit(body, meta);
    },
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    _getUUID() {
      return this.db.get("UUID");
    },
    _setUUID(UUID) {
      this.db.set("UUID", UUID);
    },
    generateMeta(message) {
      const {
        id, created_timestamp: dateTIme,
      } = message;
      return {
        id,
        summary: this.getSummary(id),
        ts: Date.parse(dateTIme),
      };
    },
    isValidSignature(req) {
      const UUID = this._getUUID();
      return signatureHelper.isValidSignatureFromString(
        req.bodyRaw,
        UUID,
        req.headers["x-kc-signature"],
      );
    },
  },
  async run(req) {
    if (this.isValidSignature(req)) {
      this.emitEvent(req.body);
    }
  },
};
