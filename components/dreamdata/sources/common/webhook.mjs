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
    _isAuthorized(event) {
      if (!this.signingKey) return true;
      const headerName = (this.signatureHeader ?? constants.WEBHOOK_SIGNATURE_HEADER).toLowerCase();
      const headers = event.headers ?? {};
      const signature = headers[headerName] ?? headers[headerName.toUpperCase()];
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
