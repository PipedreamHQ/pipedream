import datadog from "../../datadog.app.mjs";
import { payloadFormat } from "../common/payload-format.mjs";

export default {
  key: "datadog-new-monitor-event",
  name: "New Monitor Event (Instant)",
  description: "Emit new events captured by a Datadog monitor",
  dedupe: "unique",
  version: "0.1.1",
  type: "source",
  props: {
    datadog,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    monitors: {
      propDefinition: [
        datadog,
        "monitors",
      ],
    },
  },
  hooks: {
    async activate() {
      const {
        name: webhookName,
        secretKey: webhookSecretKey,
      } = await this.datadog.createWebhook(
        this.http.endpoint,
        payloadFormat,
      );

      console.log(`Created webhook "${webhookName}"`);
      this._setWebhookName(webhookName);
      this._setWebhookSecretKey(webhookSecretKey);

      await Promise.all(
        this.monitors.map((monitorId) =>
          this.datadog.addWebhookNotification(webhookName, monitorId)),
      );
    },
    async deactivate() {
      const webhookName = this._getWebhookName();
      await this.datadog.removeWebhookNotifications(webhookName);
      await this.datadog.deleteWebhook(webhookName);
    },
  },
  methods: {
    _getWebhookName() {
      return this.db.get("webhookName");
    },
    _setWebhookName(webhookName) {
      this.db.set("webhookName", webhookName);
    },
    _getWebhookSecretKey() {
      return this.db.get("webhookSecretKey");
    },
    _setWebhookSecretKey(webhookSecretKey) {
      this.db.set("webhookSecretKey", webhookSecretKey);
    },
    generateMeta(data) {
      const {
        id,
        eventTitle: summary,
        date: ts,
      } = data;
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run(event) {
    const webhookSecretKey = this._getWebhookSecretKey();
    if (!this.datadog.isValidSource(event, webhookSecretKey)) {
      console.log("Skipping event from unrecognized source");
      this.http.respond({
        status: 404,
      });
      return;
    }

    // Acknowledge the event back to Datadog.
    this.http.respond({
      status: 200,
    });

    const { body } = event;
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
