import crypto from "crypto";
import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-monitor-event",
  name: "Monitor Event (Webhook)",
  description: "Triggers when a Pubrio monitor fires. Copy the webhook URL into your Pubrio monitor configuration.",
  version: "0.0.1",
  type: "source",
  props: {
    pubrio,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  async run(event) {
    this.http.respond({ status: 200, body: "OK" });
    this.$emit(event.body, {
      id: event.body?.monitor_id || crypto.randomUUID(),
      summary: `Pubrio monitor event: ${event.body?.signal_type || "unknown"}`,
      ts: Date.now(),
    });
  },
};
