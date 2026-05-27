import crypto from "crypto";
import dreamdata from "../../dreamdata.app.mjs";
import constants from "../../common/constants.mjs";
import { verifyHmacSignature } from "../../common/utils.mjs";

export default {
  props: {
    dreamdata,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    signingKey: {
      type: "string",
      label: "Webhook Signing Key",
      description: "Optional. Per-sync signing key from the Dreamdata webhook sync's actions menu. If provided, inbound payloads will be verified via HMAC-SHA256 and unsigned/invalid requests will be rejected with 401.",
      secret: true,
      optional: true,
    },
    signatureHeader: {
      type: "string",
      label: "Signature Header Name",
      description: "Header name carrying the HMAC-SHA256 signature from Dreamdata. Defaults to `x-dreamdata-signature`. Adjust if your sync uses a different header.",
      default: constants.WEBHOOK_SIGNATURE_HEADER,
      optional: true,
    },
  },
  methods: {
    _getHeader(headers = {}, name) {
      const normalizedName = name.toLowerCase();
      const matchedHeader = Object
        .entries(headers)
        .find(([
          headerName,
        ]) => headerName.toLowerCase() === normalizedName);
      return matchedHeader?.[1];
    },
    _getMetadata(body) {
      return body?.metadata ?? {};
    },
    _getMessageId(body) {
      return this._getMetadata(body).message_id ?? body?.message_id;
    },
    _stableStringify(value) {
      if (Array.isArray(value)) {
        return `[${value.map((item) => this._stableStringify(item)).join(",")}]`;
      }
      if (value && typeof value === "object") {
        const entries = Object
          .keys(value)
          .sort()
          .map((key) => `${JSON.stringify(key)}:${this._stableStringify(value[key])}`);
        return `{${entries.join(",")}}`;
      }
      return JSON.stringify(value);
    },
    _getFallbackId(body) {
      return crypto
        .createHash("sha256")
        .update(this._stableStringify(body ?? {}))
        .digest("hex");
    },
    _getEventId(body) {
      return this._getMessageId(body) ?? this._getFallbackId(body);
    },
    _getSentAt(body) {
      return this._getMetadata(body).sent_at ?? body?.sent_at;
    },
    _getAudienceName(body) {
      return this._getMetadata(body).audience?.name ?? body?.audience?.name ?? "audience";
    },
    _getEventTs(body) {
      const sentAt = this._getSentAt(body);
      const ts = sentAt
        ? Date.parse(sentAt)
        : Date.now();
      return Number.isNaN(ts)
        ? Date.now()
        : ts;
    },
    _isAuthorized(event) {
      if (!this.signingKey) return true;
      const headerName = (this.signatureHeader ?? constants.WEBHOOK_SIGNATURE_HEADER).toLowerCase();
      const headers = event.headers ?? {};
      const signature = this._getHeader(headers, headerName);
      const rawBody = event.bodyRaw ?? event.body;
      return verifyHmacSignature({
        rawBody,
        signature,
        signingKey: this.signingKey,
      });
    },
    _summarize() {
      throw new Error("_summarize() must be implemented by the source");
    },
  },
  async run(event) {
    if (!this._isAuthorized(event)) {
      this.http.respond({
        status: 401,
        body: "Invalid signature",
      });
      return;
    }
    this.http.respond({
      status: 200,
      body: "ok",
    });
    const body = event.body;
    if (!body) return;
    const meta = this._summarize(body);
    this.$emit(body, meta);
  },
};
