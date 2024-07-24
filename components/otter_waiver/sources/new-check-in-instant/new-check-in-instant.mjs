import otterWaiver from "../../otter_waiver.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "otter_waiver-new-check-in-instant",
  name: "New Check-In Instant",
  description: "Emit new event when a participant checks into an event. [See the documentation](https://api.otterwaiver.com/docs/webhook)",
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
    eventName: {
      propDefinition: [
        otterWaiver,
        "eventName",
      ],
    },
    checkInTime: {
      propDefinition: [
        otterWaiver,
        "checkInTime",
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
      const checkIns = await this.otterWaiver.getLatestCheckIns();
      for (const checkIn of checkIns) {
        this.$emit(checkIn, {
          id: checkIn.id,
          summary: `New check-in: ${checkIn.signee.firstName} ${checkIn.signee.lastName}`,
          ts: Date.parse(checkIn.timeStamps.checkedIn),
        });
      }
    },
    async activate() {
      const webhook = this.http.endpoint;
      const { id } = await this.otterWaiver.subscribeToEvent({
        trigger: "CheckIn",
        webhook,
      });
      this._setWebhookId(id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.otterWaiver.unsubscribeFromEvent({
          trigger: "CheckIn",
          webhook: this.http.endpoint,
        });
      }
    },
  },
  async run(event) {
    const computedSignature = crypto.createHmac("sha256", this.otterWaiver.$auth.api_key)
      .update(event.raw_body)
      .digest("base64");
    if (computedSignature !== event.headers["x-otter-signature"]) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }
    this.http.respond({
      status: 200,
      body: "OK",
    });

    const checkIn = event.body;
    this.$emit(checkIn, {
      id: checkIn.id,
      summary: `New check-in: ${checkIn.signee.firstName} ${checkIn.signee.lastName}`,
      ts: Date.parse(checkIn.timeStamps.checkedIn),
    });
  },
};
