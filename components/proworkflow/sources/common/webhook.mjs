import { ConfigurationError } from "@pipedream/platform";
import common from "./base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const {
        details: [
          { id: webhookId },
        ],
      } =
        await this.createWebhook({
          data: {
            url: this.http.endpoint,
            event: this.getEventName(),
          },
        });

      this.setWebhookId(webhookId);
    },
    async deactivate() {
      const webhookId = this.getWebhookId();
      if (webhookId) {
        await this.deleteWebhook({
          webhookId,
        });
      }
    },
  },
  methods: {
    ...common.methods,
    setWebhookId(value) {
      this.db.set(constants.WEBHOOK_ID, value);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    getEventName() {
      throw new ConfigurationError("getEventName is not implemented");
    },
    createWebhook(args = {}) {
      return this.app.create({
        path: "/settings/webhooks",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    } = {}) {
      return this.app.delete({
        path: `/settings/webhooks/${webhookId}`,
        ...args,
      });
    },
  },
  async run({ body }) {
    const {
      id,
      url,
    } = body;

    if (!url) {
      console.log("No URL provided from event");
      return;
    }

    console.log("Making a request to", url);
    const response = await this.app.makeRequest({
      url,
    });

    const event = {
      id,
      url,
      ...response,
    };

    this.$emit(event, this.generateMeta(event));
  },
};
