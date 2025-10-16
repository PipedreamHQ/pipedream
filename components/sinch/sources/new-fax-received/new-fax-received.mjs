import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "sinch-new-fax-received",
  name: "New Fax Received (Instant)",
  description: "Emit new event when a new fax is received. [See the documentation](https://developers.sinch.com/docs/fax/api-reference/fax/tag/Services/#tag/Services/operation/createService)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  hooks: {
    async activate() {
      const { id } = await this.sinch.createService({
        data: {
          incomingWebhookUrl: this.http.endpoint,
          webhookContentType: "application/json",
          defaultForProject: true,
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const serviceId = this._getHookId();
      if (serviceId) {
        await this.sinch.deleteService({
          serviceId,
        });
      }
    },
  },
  methods: {
    ...common.methods,
    generateMeta(event) {
      return {
        id: event.fax.id,
        summary: `New fax from: ${event.fax.from}`,
        ts: Date.parse(event.eventTime),
      };
    },
  },
  sampleEmit,
};
