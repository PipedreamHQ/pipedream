import datadog from "../../datadog.app.mjs";
import { payloadFormat } from "../common/payload-format.mjs";

export default {
  key: "datadog-new-monitor-event",
  name: "New Monitor Event (Instant)",
  description: "Emit new events captured by a Datadog monitor",
  dedupe: "unique",
  version: "0.1.3",
  type: "source",
  props: {
    datadog,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    region: {
      propDefinition: [
        datadog,
        "region",
      ],
    },
    monitors: {
      propDefinition: [
        datadog,
        "monitors",
        (c) => ({
          region: c.region,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      // emit historical events
      const { events } = await this.datadog.getEvents({
        params: {
          start: Math.floor(this.datadog.daysAgo(7) / 1000), // one week ago
          end: Math.floor(Date.now() / 1000), // now
        },
        region: this.region,
      });
      const relevantEvents = events.filter((event) => this.monitors.includes(event.monitor_id));

      for (const event of relevantEvents.reverse().slice(-25)) {
        const payload = {
          alertTitle: event.eventTitle,
          alertType: event.alert_type,
          date: event.date_happened,
          eventMsg: event.text,
          eventTitle: event.title,
          hostname: event.host,
          id: event.id,
          lastUpdated: event.date_happened,
          link: `https://app.datadoghq.com${event.url}`,
          priority: event.priority,
          tags: event.tags.join(),
        };
        const meta = this.generateMeta(payload);
        this.$emit(payload, meta);
      }
    },
    async activate() {
      const {
        name: webhookName,
        secretKey: webhookSecretKey,
      } = await this.datadog.createWebhook(
        this.http.endpoint,
        payloadFormat,
        this.region,
      );

      console.log(`Created webhook "${webhookName}"`);
      this._setWebhookName(webhookName);
      this._setWebhookSecretKey(webhookSecretKey);

      await Promise.all(
        this.monitors.map((monitorId) =>
          this.datadog.addWebhookNotification(webhookName, monitorId, this.region)),
      );
    },
    async deactivate() {
      const webhookName = this._getWebhookName();
      await this.datadog.removeWebhookNotifications(webhookName, this.region);
      await this.datadog.deleteWebhook(webhookName, this.region);
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
