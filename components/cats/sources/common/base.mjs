import {
  createHmac, randomUUID,
} from "crypto";
import cats from "../../cats.app.mjs";

export default {
  props: {
    cats,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    _getUUID() {
      return this.db.get("UUID");
    },
    _setUUID(UUID) {
      this.db.set("UUID", UUID);
    },
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getExtraData() {
      return {};
    },
    checkSignature({
      bodyRaw, headers,
    }) {
      const uuid = this._getUUID();
      const hash = createHmac("sha256", uuid).update(`${bodyRaw}${headers["x-request-id"]}`)
        .digest()
        .toString("hex");

      console.log("hash: ", hash);

      return headers["x-signature"] === `HMAC-SHA256 ${hash}`;
    },
  },
  hooks: {
    async activate() {
      const uuid = randomUUID();
      const { headers } = await this.cats.createWebhook({
        returnFullResponse: true,
        data: {
          target_url: this.http.endpoint,
          events: this.getEventType(),
          secret: uuid,
        },
      });

      const location = headers.location.split("/");
      const webhookId = location[location.length - 1];

      this._setUUID(uuid);
      this._setHookId(webhookId);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.cats.deleteWebhook(webhookId);
    },
  },
  async run({
    body, ...event
  }) {
    if (!this.checkSignature(event)) {
      return this.http.respond({
        status: 400,
      });
    }

    console.log("this.generateMeta(body): ", this.generateMeta(body));

    this.$emit(body, this.generateMeta(body));
  },
};
