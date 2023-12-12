import base from "../common/base.mjs";

export default {
  ...base,
  key: "shipstation-new-event",
  name: "New Event (Instant)",
  description: "Emit new event for each new webhook event received. [See docs here](https://www.shipstation.com/docs/api/webhooks/subscribe/)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...base.methods,
    async emitEvent(event) {
      const { body } = event;

      const resource = await this.shipstation.getResourceByUrl({
        url: body.resource_url,
      });

      const ts = new Date();

      this.$emit(resource, {
        id: ts,
        summary: `New event ${ts.getTime()} received`,
        ts,
      });
    },
  },
};
