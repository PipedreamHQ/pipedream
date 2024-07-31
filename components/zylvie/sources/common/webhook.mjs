import { ConfigurationError } from "@pipedream/platform";
import app from "../../zylvie.app.mjs";

export default {
  props: {
    app,
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const {
        createWebhook,
        getTriggerName,
        http: { endpoint },
      } = this;
      await createWebhook({
        debug: true,
        data: {
          trigger: getTriggerName(),
          webhook_url: endpoint,
        },
      });
    },
    async deactivate() {
      const {
        deleteWebhook,
        http: { endpoint },
      } = this;
      await deleteWebhook({
        debug: true,
        data: {
          webhook_url: endpoint,
        },
      });
    },
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    getTriggerName() {
      throw new ConfigurationError("getTriggerName is not implemented");
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    createWebhook(args = {}) {
      return this.app.post({
        path: "/webhooks/subscribe",
        ...args,
      });
    },
    deleteWebhook(args = {}) {
      return this.app.delete({
        path: "/webhooks/unsubscribe",
        ...args,
      });
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    this.processResource(body);
  },
};
