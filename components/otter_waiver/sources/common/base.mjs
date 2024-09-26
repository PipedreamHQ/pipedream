// import crypto from "crypto";
import otterWaiver from "../../otter_waiver.app.mjs";

export default {
  type: "source",
  dedupe: "unique",
  props: {
    otterWaiver,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    emitEvent(event) {
      this.$emit(event, {
        id: event.id,
        summary: this.getSummary(event),
        ts: Date.now(),
      });
    },
  },
  hooks: {
    async deploy() {
      const fn = this.getFunction();
      const response = await fn();
      if (response.length > 25) response.length = 25;

      for (const item of response) {
        this.emitEvent(item);
      }
    },
    async activate() {
      await this.otterWaiver.createWebhook({
        data: {
          trigger: this.getEvent(),
          webhook: this.http.endpoint,
        },
      });

    },
    async deactivate() {
      await this.otterWaiver.deleteWebhook({
        data: {
          trigger: this.getEvent(),
          webhook: this.http.endpoint,
        },
      });
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
      body: "OK",
    });

    this.emitEvent(body);
  },
};
