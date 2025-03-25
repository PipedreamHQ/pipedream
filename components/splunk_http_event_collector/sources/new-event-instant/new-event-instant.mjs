import splunk from "../../splunk_http_event_collector.app.mjs";
import crypto from "crypto";

export default {
  key: "splunk_http_event_collector-new-event-instant",
  name: "New Event Instant",
  description: "Emit new events when logs or events are received by the Splunk HTTP Event Collector. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    splunk,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    filterSourceType: {
      propDefinition: [
        "splunk_http_event_collector",
        "filterSourceType",
      ],
      optional: true,
    },
    filterIndex: {
      propDefinition: [
        "splunk_http_event_collector",
        "filterIndex",
      ],
      optional: true,
    },
    filterFields: {
      propDefinition: [
        "splunk_http_event_collector",
        "filterFields",
      ],
      optional: true,
    },
  },
  methods: {
    _computeSignature(rawBody) {
      const secretKey = this.splunk.$auth.token;
      return crypto.createHmac("sha256", secretKey).update(rawBody)
        .digest("base64");
    },
    _isValidSignature(event) {
      const signature = event.headers["x-splunk-signature"];
      const rawBody = event.rawBody;
      const computedSignature = this._computeSignature(rawBody);
      return signature === computedSignature;
    },
    _filterEvent(eventData) {
      const {
        filterSourceType, filterIndex, filterFields,
      } = this;
      if (filterSourceType && eventData.sourcetype?.toLowerCase()
        !== filterSourceType.toLowerCase()) {
        return false;
      }
      if (filterIndex && eventData.index?.toLowerCase() !== filterIndex.toLowerCase()) {
        return false;
      }
      if (filterFields && filterFields.length > 0) {
        if (!eventData.fields) return false;
        for (const field of filterFields) {
          if (!Object.prototype.hasOwnProperty.call(eventData.fields, field)) {
            return false;
          }
        }
      }
      return true;
    },
    async _createWebhook() {
      // Assuming the app has a method to create a webhook
      const webhookId = await this.splunk_http_event_collector.createWebhook();
      await this.db.set("webhookId", webhookId);
    },
    async _deleteWebhook() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.splunk_http_event_collector.deleteWebhook(webhookId);
        await this.db.set("webhookId", null);
      }
    },
  },
  hooks: {
    async deploy() {
      try {
        const health = await this.splunk_http_event_collector.checkHealth();
        console.log("Splunk HTTP Event Collector is healthy:", health);
      } catch (error) {
        console.error("Failed to check Splunk HTTP Event Collector health:", error);
      }
    },
    async activate() {
      try {
        await this._createWebhook();
        console.log("Splunk HTTP Event Collector webhook activated.");
      } catch (error) {
        console.error("Failed to activate Splunk HTTP Event Collector webhook:", error);
      }
    },
    async deactivate() {
      try {
        await this._deleteWebhook();
        console.log("Splunk HTTP Event Collector webhook deactivated.");
      } catch (error) {
        console.error("Failed to deactivate Splunk HTTP Event Collector webhook:", error);
      }
    },
  },
  async run(event) {
    if (!this._isValidSignature(event)) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    let eventData;
    try {
      eventData = JSON.parse(event.body);
    } catch (error) {
      this.http.respond({
        status: 400,
        body: "Invalid JSON",
      });
      return;
    }

    if (!this._filterEvent(eventData)) {
      this.http.respond({
        status: 200,
        body: "Event filtered out",
      });
      return;
    }

    const id = eventData.fields?.id
      ? eventData.fields.id.toString()
      : Date.now().toString();
    const ts = eventData.fields?.time
      ? Date.parse(eventData.fields.time)
      : Date.now();
    const summary = `New event received from sourcetype: ${eventData.sourcetype}`;

    this.$emit(eventData.event, {
      id,
      summary,
      ts,
    });

    this.http.respond({
      status: 200,
      body: "Event received successfully",
    });
  },
};
