import trint from "../../trint.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    trint,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      await this.trint.registerWebhook({
        data: {
          callbackUrl: this.http.endpoint,
          callbackSubscriptions: this.getEventTypes(),
        },
      });
    },
    async deactivate() {
      await this.trint.deregisterWebhook({
        data: {
          callbackUrl: this.http.endpoint,
        },
      });
    },
  },
  methods: {
    getEventTypes() {
      throw new ConfigurationError("getEventTypes is not implemented");
    },
    generateMeta(body) {
      return {
        id: body.transcriptId,
        summary: `New ${body.eventType} event`,
        ts: Date.now(),
      };
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    if (!body) {
      return;
    }

    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
