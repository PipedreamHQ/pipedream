import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "fathom-new-recording",
  name: "New Recording (Instant)",
  description: "Emit new event when a new recording is created. [See the documentation](https://developers.fathom.ai/api-reference/webhooks/create-a-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    triggeredFor: {
      type: "string[]",
      label: "Triggered For",
      description: "The types of recordings to trigger the webhook",
      options: [
        "my_recordings",
        "shared_external_recordings",
        "my_shared_with_team_recordings",
        "shared_team_recordings",
      ],
    },
  },
  methods: {
    ...common.methods,
    getWebhookData() {
      return {
        triggered_for: this.triggeredFor,
        include_action_items: this.include.includes("action_items"),
        include_crm_matches: this.include.includes("crm_matches"),
        include_summary: this.include.includes("summary"),
        include_transcript: this.include.includes("transcript"),
      };
    },
    generateMeta(event) {
      return {
        id: event.recording_id,
        summary: `New recording: ${event.recording_id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
