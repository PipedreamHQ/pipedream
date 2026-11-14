import { ConfigurationError } from "@pipedream/platform";
import crypto from "crypto";
import app from "../../nevtan_mail.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    signingSecret: {
      type: "string",
      label: "Webhook Signing Secret",
      description:
        "Optional. NevTan Mail signs every delivery, but its API does not return the signing secret, so leave this blank unless you can read the subscription's secret directly from your workspace. Supplied, each delivery is verified and anything unsigned, altered or older than five minutes is rejected. Left blank, the trigger URL is the only thing protecting this source, so treat it as a credential.",
      optional: true,
      secret: true,
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    _getSecret() {
      return this.signingSecret || this.db.get("secret");
    },
    _setSecret(secret) {
      this.db.set("secret", secret);
    },
    getEvent() {
      throw new ConfigurationError("getEvent is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    expectedSignature(secret, timestamp, bodyRaw) {
      return crypto
        .createHmac("sha256", secret)
        .update(`${timestamp}.${bodyRaw}`, "utf8")
        .digest("hex");
    },
    verifySignature(event, secret) {
      const presentedHeader = event.headers?.[constants.HEADER.SIGNATURE];
      const timestamp = event.headers?.[constants.HEADER.TIMESTAMP];
      if (!presentedHeader || !timestamp) {
        throw new Error("Request is missing the NevTan Mail signature headers.");
      }

      const presented = presentedHeader.startsWith(constants.SIGNATURE_PREFIX)
        ? presentedHeader.slice(constants.SIGNATURE_PREFIX.length)
        : presentedHeader;
      const expected = this.expectedSignature(secret, timestamp, event.bodyRaw);

      const presentedBuffer = Buffer.from(presented, "utf8");
      const expectedBuffer = Buffer.from(expected, "utf8");
      const matches = presentedBuffer.length === expectedBuffer.length
        && crypto.timingSafeEqual(presentedBuffer, expectedBuffer);
      if (!matches) {
        throw new Error("Signature does not match the payload. Request rejected.");
      }

      const signedAtMs = Number(timestamp) * 1000;
      if (!Number.isFinite(signedAtMs)
        || Date.now() - signedAtMs > constants.SIGNATURE_TOLERANCE_MS) {
        throw new Error("Signature timestamp is outside the accepted window. Request rejected.");
      }
    },
  },
  hooks: {
    async activate() {
      const hook = await this.app.createHook({
        data: {
          event: this.getEvent(),
          target_url: this.http.endpoint,
        },
      });
      this._setHookId(hook.id);
      // Stored only if a future API version returns it; today it is absent.
      if (hook.secret) {
        this._setSecret(hook.secret);
      }
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (!hookId) {
        return;
      }
      await this.app.deleteHook({
        hookId,
      });
      this._setHookId(null);
      this._setSecret(null);
    },
  },
  async run(event) {
    const secret = this._getSecret();
    if (secret) {
      this.verifySignature(event, secret);
    }

    this.http.respond({
      status: 200,
    });

    const { body } = event;
    this.$emit(body, this.generateMeta(body));
  },
};
