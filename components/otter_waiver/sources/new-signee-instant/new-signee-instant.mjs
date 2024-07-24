import otterWaiver from "../../otter_waiver.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "otter_waiver-new-signee-instant",
  name: "New Signee Instant",
  description: "Emit new event when a new signee is created. [See the documentation](https://api.otterwaiver.com/docs/webhook)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    otterWaiver: {
      type: "app",
      app: "otter_waiver",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    signeeDetails: {
      propDefinition: [
        otterWaiver,
        "signeeDetails",
      ],
    },
    signeePreferences: {
      propDefinition: [
        otterWaiver,
        "signeePreferences",
      ],
      optional: true,
    },
    signeeSubscriptions: {
      propDefinition: [
        otterWaiver,
        "signeeSubscriptions",
      ],
      optional: true,
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async deploy() {
      const participants = await this.otterWaiver.getLatestParticipants();
      for (const participant of participants) {
        this.$emit(participant, {
          id: participant.id,
          summary: `New signee: ${participant.signee.firstName} ${participant.signee.lastName}`,
          ts: Date.parse(participant.createdAt),
        });
      }
    },
    async activate() {
      const webhookId = await this.otterWaiver.subscribeToEvent({
        trigger: "New Signee",
        webhook: this.http.endpoint,
      });
      this._setWebhookId(webhookId);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.otterWaiver.unsubscribeFromEvent({
        trigger: "New Signee",
        webhook: this.http.endpoint,
      });
    },
  },
  async run(event) {
    const secretKey = this.otterWaiver.$auth.api_key;
    const rawBody = event.raw_body;
    const webhookSignature = event.headers["x-webhook-signature"];
    const computedSignature = crypto.createHmac("sha256", secretKey).update(rawBody)
      .digest("base64");

    if (computedSignature !== webhookSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const signee = event.body;
    this.$emit(signee, {
      id: signee.id,
      summary: `New signee: ${signee.signee.firstName} ${signee.signee.lastName}`,
      ts: Date.parse(signee.createdAt),
    });

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
