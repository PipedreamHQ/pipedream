import ninjaone from "../../ninjaone.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "ninjaone-new-device-online-instant",
  name: "New Device Online",
  description: "Emit new event when a monitored device comes online. Users can specify a device group or type to monitor. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ninjaone: {
      type: "app",
      app: "ninjaone",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    deviceGroup: {
      propDefinition: [
        ninjaone,
        "deviceGroup",
      ],
      optional: true,
    },
    deviceType: {
      propDefinition: [
        ninjaone,
        "deviceType",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const devices = await this.ninjaone.emitDeviceOnline({
        deviceGroup: this.deviceGroup,
        deviceType: this.deviceType,
      });
      devices.slice(0, 50).forEach((device) => {
        this.$emit(device, {
          id: device.id,
          summary: `Device online: ${device.name}`,
          ts: new Date().getTime(),
        });
      });
    },
    async activate() {
      const webhookData = await this.ninjaone.createWebhook({
        event: "device_online",
        targetUrl: this.http.endpoint,
      });
      this.db.set("webhookId", webhookData.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.ninjaone.deleteWebhook(webhookId);
        this.db.set("webhookId", null);
      }
    },
  },
  methods: {
    async verifySignature(event) {
      const signature = event.headers["x-ninja-signature"];
      const rawBody = event.bodyRaw;
      const secretKey = this.ninjaone.$auth.webhook_secret_key;
      const computedSignature = crypto.createHmac("sha256", secretKey).update(rawBody)
        .digest("base64");
      return computedSignature === signature;
    },
  },
  async run(event) {
    if (!(await this.verifySignature(event))) {
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

    this.$emit(event.body, {
      id: event.body.id,
      summary: `Device online: ${event.body.name}`,
      ts: Date.parse(event.body.timestamp),
    });
  },
};
