import sanity from "../../sanity.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { API_VERSION } from "../../common/constants.mjs";

export default {
  props: {
    sanity,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    name: {
      type: "string",
      label: "Webhook Name",
      description: "The name of the webhook",
    },
    dataset: {
      propDefinition: [
        sanity,
        "dataset",
      ],
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getWebhookArgs() {
      throw new ConfigurationError("getWebhookArgs is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
  hooks: {
    async activate() {
      const webhookArgs = this.getWebhookArgs();
      const { id } = await this.sanity.createWebhook({
        data: {
          name: this.name,
          url: this.http.endpoint,
          dataset: this.dataset,
          apiVersion: API_VERSION,
          ...webhookArgs,
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.sanity.deleteWebhook({
          hookId,
        });
      }
    },
  },
  async run({ body }) {
    if (!body) {
      return;
    }

    this.http.respond({
      status: 200,
    });

    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
