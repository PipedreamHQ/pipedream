import benchmarkone from "../../benchmarkone.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "benchmarkone-new-webhook-automation-event-instant",
  name: "New Webhook Automation Event (Instant)",
  description: "Emit new event when a webhook automation step is triggered in BenchmarkONE.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    benchmarkone,
    http: "$.interface.http",
    db: "$.service.db",
    alert: {
      type: "alert",
      alertType: "warning",
      content: "BenchmarkONE does not provide a way to delete webhooks through API. If you want to stop receiving events, you'll need to delete this source and the webhook from the [BenchmarkONE UI > Account Settings > Data > Webhooks](https://app.hatchbuck.com/account/setting#Webhooks)",
    },
    webhookName: {
      type: "string",
      label: "Webhook Name",
      description: "Webhook name for display in the BenchmarkONE UI.",
      optional: true,
    },
  },
  methods: {},
  hooks: {
    async activate() {
      await this.benchmarkone.createWebhook({
        data: {
          URL: this.http.endpoint,
          WebHookName: this.webhookName,
          Trigger: "all triggers",
        },
      });
    },
  },
  async run({ body }) {
    const ts = Date.parse(body.Data.createdDt || new Date());
    this.$emit(body, {
      id: `${body.Data.contactId}-${ts}`,
      summary: "New Automation Event",
      ts: ts,
    });
  },
  sampleEmit,
};
