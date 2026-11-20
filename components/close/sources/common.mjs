import crypto from "crypto";
import close from "../close.app.mjs";
import {
  SIGNATURE_HASH_HEADER,
  SIGNATURE_TIMESTAMP_HEADER,
} from "../common/constants.mjs";

export default {
  props: {
    close,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    _getHookID() {
      return this.db.get("hookId");
    },
    _setHookID(hookID) {
      this.db.set("hookId", hookID);
    },
    _getSignatureKey() {
      return this.db.get("signatureKey");
    },
    _setSignatureKey(signatureKey) {
      this.db.set("signatureKey", signatureKey);
    },
    isValidSignature({
      headers, bodyRaw,
    }, signatureKey) {
      const hash = headers[SIGNATURE_HASH_HEADER];
      const timestamp = headers[SIGNATURE_TIMESTAMP_HEADER];
      if (!hash || !timestamp) {
        return false;
      }
      const expected = crypto
        .createHmac("sha256", Buffer.from(signatureKey, "hex"))
        .update(timestamp + bodyRaw)
        .digest("hex");
      const hashBuffer = Buffer.from(hash);
      const expectedBuffer = Buffer.from(expected);
      return hashBuffer.length === expectedBuffer.length
        && crypto.timingSafeEqual(hashBuffer, expectedBuffer);
    },
  },
  hooks: {
    async activate() {
      const response = await this.close.createHook({
        data: {
          events: this.getEvents(),
          url: this.http.endpoint,
        },
      });
      this._setHookID(response.data.id);
      this._setSignatureKey(response.data.signature_key);
    },
    async deactivate() {
      const hookId = this._getHookID();
      await this.close.deleteHook({
        hookId,
      });
    },
  },
  async run(event) {
    const signatureKey = this._getSignatureKey();
    if (signatureKey && !this.isValidSignature(event, signatureKey)) {
      this.http.respond({
        status: 401,
      });
      return;
    }
    this.http.respond({
      status: 200,
    });
    this.$emit({
      event,
    },
    {
      id: event.body.event.id,
      ts: Date.parse(event.body.event.date_created),
      summary: `New event (ID:${event.body.event.id})`,
    });
  },
};
