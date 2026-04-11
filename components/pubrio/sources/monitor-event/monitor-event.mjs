import crypto from "crypto";
import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-monitor-event",
  name: "New Monitor Event (Webhook)",
  description: "Emit new event when a Pubrio monitor fires. Copy the webhook URL into your Pubrio monitor configuration.",
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
    this.http.respond({
      status: 200,
      body: "OK",
    });
    const payload = event.body ?? {};
    const dedupeId = payload?.event_id
      || payload?.id
      || crypto.randomUUID();
    this.$emit(payload, {
      id: dedupeId,
      summary: `Pubrio monitor event: ${payload?.signal_type || "unknown"}`,
      ts: Date.now(),
    });
  },
};
