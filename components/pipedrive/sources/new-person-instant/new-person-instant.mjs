import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pipedrive-new-person-instant",
  name: "New Person (Instant)",
  description: "Emit new event when a new person is created in Pipedrive, via a webhook registered on the connected account. Each event is the Pipedrive webhook (v2) payload: `meta` (action, entity, entity ID, timestamp, user) and `data` (the new person). Custom fields in `data` are keyed by their 40-character field hash. Use **Get person details** to fetch the full record. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Webhooks#addWebhook)",
  version: "0.0.19",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getExtraData() {
      return {
        event_action: "create",
        event_object: "person",
      };
    },
    getSummary(body) {
      return `New Person successfully created: ${body.data.id}`;
    },
  },
  sampleEmit,
};
