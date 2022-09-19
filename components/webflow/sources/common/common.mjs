import webflow from "../../webflow.app.mjs";
import { v4 as uuid } from "uuid";
import { axios } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  dedupe: "unique",
  props: {
    webflow,
    siteId: {
      propDefinition: [
        webflow,
        "sites",
      ],
    },
    db: "$.service.db",
    http: "$.interface.http",
  },
  methods: {
    async _makeRequest(path, params = {}) {
      return axios(this, {
        url: "https://api.webflow.com" + path,
        headers: {
          "Authorization": `Bearer ${this.webflow.$auth.oauth_access_token}`,
          "Accept-Version": "1.0.0",
        },
        params,
      });
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    getWebhookTriggerType() {
      throw new Error("getWebhookTriggerType is not implemented");
    },
    getWebhookFilter() {
      return {};
    },
    isEventRelevant(event) {
      if (event) return true;
    },
    generateMeta(data) {
      return {
        id: data.id || uuid(),
        summary: "New event",
        ts: Date.now(),
      };
    },
    processEvent(event) {
      if (!this.isEventRelevant(event)) {
        return;
      }

      const { body } = event;
      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    },
    emitHistoricalEvents(events, limit = constants.DEPLOY_OFFSET) {
      for (const event of events.slice(0, limit)) {
        const meta = this.generateMeta(event);
        this.$emit(event, meta);
      }
    },
  },
  hooks: {
    async activate() {
      const { endpoint } = this.http;
      const triggerType = this.getWebhookTriggerType();
      const filter = this.getWebhookFilter();
      const webhook = await this.webflow.createWebhook(
        this.siteId, endpoint, triggerType, filter,
      );

      this._setWebhookId(webhook._id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.webflow.removeWebhook(this.siteId, webhookId);
    },
  },
  async run(event) {
    await this.processEvent(event);
  },
};
