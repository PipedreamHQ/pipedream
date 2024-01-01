import { randomUUID } from "crypto";
import { secureCompare } from "../../common/utils.mjs";
import resourceGuru from "../../resource_guru.app.mjs";

export default {
  props: {
    resourceGuru,
    db: "$.service.db",
    http: "$.interface.http",
  },
  methods: {
    setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getHookId() {
      return this.db.get("hookId");
    },
    setHookSecret(secret) {
      this.db.set("secret", secret);
    },
    getHookSecret() {
      return this.db.get("secret");
    },
  },
  hooks: {
    async activate() {
      const secret = randomUUID();
      const response = await this.resourceGuru.createHook({
        data: {
          "name": "Pipedream_new-or-updated-booking",
          "payload_url": this.http.endpoint,
          "events": this.getEvents(),
          "secret": secret,
          "send_secret_header": true,
          "paused": false,
        },
      });

      this.setHookSecret(secret);
      this.setHookId(response.id);
    },
    async deactivate() {
      await this.resourceGuru.deleteHook(this.getHookId());
    },
  },
  async run(event) {
    const secret = this.getHookSecret();
    const {
      headers,
      body,
      bodyRaw,
    } = event;
    if (!secureCompare(headers["x-resourceguru-signature"], bodyRaw, secret)) {
      return false;
    }

    this.$emit(body, {
      id: body.id,
      summary: this.getSummary(body),
      ts: body.timestamp,
    });
  },
};
