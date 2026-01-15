import confluenceDataCenter from "../../confluence_data_center.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    confluenceDataCenter,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    name: {
      type: "string",
      label: "Webhook Name",
      description: "The name of the webhook to identify in Confluence Data Center",
    },
  },
  hooks: {
    async activate() {
      const response = await this.confluenceDataCenter.createWebhook({
        data: {
          name: this.name,
          url: this.http.endpoint,
          events: this.getEvents(),
        },
      });
      this._setHookId(response.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.confluenceDataCenter.deleteWebhook({
          hookId,
        });
      }
    },
  },
  methods: {
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    _getHookId() {
      return this.db.get("hookId");
    },
    generateMeta(body) {
      return {
        id: body.timestamp,
        summary: `New ${body.event} event`,
        ts: body.timestamp,
      };
    },
    getEvents() {
      throw new ConfigurationError("getEvents is not implemented");
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    const { body } = event;

    if (!body) {
      return;
    }

    this.$emit(body, this.generateMeta(body));
  },
};
