import waiverfile from "../../waiverfile.app.mjs";

export default {
  key: "waiverfile-new-waiver-instant",
  name: "New Waiver Instant",
  description: "Emits a new event each time a new waiver is collected in WaiverFile",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    waiverfile: {
      type: "app",
      app: "waiverfile",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const { data } = await this.waiverfile.subscribeNewWaiver();
      this.db.set("subscriptionId", data.id);
    },
    async deactivate() {
      const subscriptionId = this.db.get("subscriptionId");
      await this.waiverfile.deleteWebhook(subscriptionId);
    },
  },
  async run(event) {
    const { body } = event;
    this.$emit(body, {
      id: body.id,
      summary: `New waiver collected: ${body.name}`,
      ts: Date.now(),
    });
  },
};
