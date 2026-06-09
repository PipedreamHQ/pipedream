import base from "../common/base-webhook.mjs";

export default {
  ...base,
  key: "shipstation-new-event",
  name: "New Event (Instant)",
  description: "Emit new event for each new webhook event received. [See docs here](https://www.shipstation.com/docs/api/webhooks/subscribe/)",
  version: "0.0.2",
  type: "source",
  methods: {
    ...base.methods,
    async emitEvent(event) {
      const { body } = event;

      const resource = await this.shipstation.getResourceByUrl({
        url: body.resource_url,
      });

      this.$emit(resource, {
        id: require("crypto").createHash("sha256")
          .update(body.resource_url)
          .digest("hex")
          .slice(0, 64),
        summary: `New ${body.resource_type} event`,
        ts: Date.now(),
      });
    },
  },
};
