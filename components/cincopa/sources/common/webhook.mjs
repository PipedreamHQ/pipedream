import { v4 as uuid } from "uuid";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../cincopa.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const securityKey = uuid();
      await this.createWebhook({
        params: {
          hook_url: this.http.endpoint,
          security_key: securityKey,
          events: this.getEvents(),
        },
      });
      this.setSecurityKey(securityKey);
    },
    async deactivate() {
      await this.deleteWebhook({
        params: {
          hook_url: this.http.endpoint,
        },
      });
    },
  },
  methods: {
    setSecurityKey(value) {
      this.db.set(constants.SECURITY_KEY, value);
    },
    getSecurityKey() {
      return this.db.get(constants.SECURITY_KEY);
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    getEvents() {
      throw new ConfigurationError("getEvents is not implemented");
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    createWebhook(args = {}) {
      return this.app._makeRequest({
        debug: true,
        path: "/webhook.set.json",
        ...args,
      });
    },
    deleteWebhook(args = {}) {
      return this.app._makeRequest({
        debug: true,
        path: "/webhook.delete.json",
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
