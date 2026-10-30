import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pipedrive-new-deal-instant",
  name: "New Deal (Instant)",
  description: "Emit new event when a new deal is created in Pipedrive, via a webhook registered on the connected account. Each event is the Pipedrive webhook (v2) payload: `meta` (`action`, `entity`, `entity_id`, `timestamp`, `user_id`) and `data` (the new deal). Custom fields in `data` are keyed by their 40-character field hash. Use **Get Deal** to fetch the full record. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Webhooks#addWebhook)",
  version: "0.0.19",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getExtraData() {
      return {
        event_action: "create",
        event_object: "deal",
      };
    },
    getSummary(body) {
      return `New Deal successfully created: ${body.data.id}`;
    },
  },
  sampleEmit,
};
