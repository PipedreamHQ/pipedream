import timebuzzer from "../../timebuzzer.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "timebuzzer-new-activity-instant",
  name: "New Activity (Instant)",
  description: "Emit new event whenever a new activity is logged in Timebuzzer. [See the documentation](https://my.timebuzzer.com/doc/#api-Webhook-SaveNewWebhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    timebuzzer,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      await this.timebuzzer.createWebhook({
        data: {
          url: this.http.endpoint,
          event: "NewActivity",
          active: true,
        },
      });
    },
    async deactivate() {
      await this.timebuzzer.deleteWebhook({
        params: {
          url: this.http.endpoint,
        },
      });
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 202,
    });

    this.$emit(body, {
      id: Date.now(),
      summary: `New Activity ${body.note}`,
      ts: Date.now(),
    });
  },
  sampleEmit,
};
