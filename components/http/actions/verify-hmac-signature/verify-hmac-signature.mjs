import crypto from "crypto";
import http from "../../http.app.mjs";

export default {
  name: "Verify HMAC Signature",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "http-verify-hmac-signature",
  description: "Validate HMAC signature for incoming HTTP webhook requests. Make sure to configure the HTTP trigger to \"Return a custom response from your workflow\".",
  type: "action",
  props: {
    http,
    secret: {
      type: "string",
      label: "Secret",
      description: "Your secret key used for validation",
      secret: true,
    },
    signature: {
      type: "string",
      label: "Signature",
      description: "The HMAC signature received from the incoming webhook, typically provided in a specific HTTP header",
    },
    bodyRaw: {
      type: "string",
      label: "Raw Body",
      description: "The raw request body received from the webhook caller, provided as a string without any parsing or modifications",
    },
    customResponse: {
      type: "boolean",
      label: "Return Error to Webhook Caller",
      description: "If `True`, returns a `401: Invalid credentials` error in the case of invalid authorization. **Make sure to configure the HTTP trigger to \"Return a custom response from your workflow\"**. If `False`, does not return a custom response in the case of invalid auth.",
      default: true,
    },
  },
  methods: {
    _checkHmac(secret, signature, bodyRaw) {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(bodyRaw, "utf8")
        .digest();

      const signatureBuffer = Buffer.from(signature, "hex");
      if (signatureBuffer.length !== expectedSignature.length) {
        return false;
      }
      return crypto.timingSafeEqual(signatureBuffer, expectedSignature);
    },
  },
  async run({ $ }) {
    const valid = this._checkHmac(
      this.secret,
      this.signature,
      this.bodyRaw,
    );

    if (!valid) {
      if (this.customResponse) {
        await $.respond({
          status: 401,
          headers: {},
          body: "Invalid credentials",
        });
      }
      if ($.flow) {
        return $.flow.exit("Invalid credentials");
      } else {
        throw new Error("Invalid credentials");
      }
    }

    $.export("$summary", "HTTP request successfully authenticated");
  },
};
