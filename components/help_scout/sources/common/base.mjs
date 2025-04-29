import crypto from "crypto";
import helpScout from "../../help_scout.app.mjs";

export default {
  props: {
    helpScout,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    label: {
      type: "string",
      label: "Label",
      description: "Label associated with this WebHook for better clarity.",
      optional: true,
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
      return this.db.get("secret");
    },
    _setSecret(secret) {
      this.db.set("secret", secret);
    },
    getExtraData() {
      return {};
    },
  },
  hooks: {
    async activate() {
      const secret = crypto.randomBytes(64).toString("hex");
      const { headers } = await this.helpScout.createWebhook({
        returnFullResponse: true,
        data: {
          url: this.http.endpoint,
          events: this.getEventType(),
          label: this.label,
          secret,
        },
      });
      this._setSecret(secret);
      this._setHookId(headers["resource-id"]);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.helpScout.deleteWebhook(webhookId);
    },
  },
  async run({
    bodyRaw, body, headers,
  }) {
    const hsSignature = headers["x-helpscout-signature"];
    if (hsSignature) {
      const secret = this._getSecret();
      const hash = crypto.createHmac("sha1", secret)
        .update(bodyRaw)
        .digest("base64");

      if (hash != hsSignature) {
        return this.http.respond({
          status: 400,
        });
      }
    }

    const ts = Date.parse(new Date());
    this.$emit(body, {
      id: body.id,
      summary: this.getSummary(body),
      ts: ts,
    });

    return this.http.respond({
      status: 200,
    });
  },
};
