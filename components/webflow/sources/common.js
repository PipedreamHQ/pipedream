const { v4: uuidv4 } = require("uuid");
const webflow = require("../webflow.app");

module.exports = {
  props: {
    db: "$.service.db",
    http: "$.interface.http",
    webflow,
    siteId: {
      type: "string",
      label: "Site",
      description: "The site from which to listen events",
      async options(context) {
        const { page } = context;
        if (page !== 0) {
          return {
            options: []
          };
        }

        const sites = await this.webflow.listSites();
        const options = sites.map(site => ({
          label: site.name,
          value: site._id,
        }));
        return {
          options,
        };
      },
    },
  },
  methods: {
    getWebhookTriggerType() {
      throw new Error('getWebhookTriggerType is not implemented');
    },
    getWebhookFilter() {
      return {};
    },
    isEventRelevant(event) {
      return true;
    },
    generateMeta(data) {
      return {
        id: uuidv4(),
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
  },
  hooks: {
    async activate() {
      const { endpoint } = this.http;
      const triggerType = this.getWebhookTriggerType();
      const filter = this.getWebhookFilter();
      const webhook = await this.webflow.createWebhook(
        this.siteId, endpoint, triggerType, filter);
      const { _id: webhookId } = webhook;
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.webflow.removeWebhook(this.siteId, webhookId);
    },
  },
  async run(event) {
    await this.processEvent(event);
  },
};
