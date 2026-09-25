import { parseData } from "../../common/utils.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pipedrive-updated-deal-instant",
  name: "Deal Updated (Instant)",
  description: "Emit new event when an existing deal is changed in Pipedrive, via a webhook registered on the connected account. Each event is the Pipedrive webhook (v2) payload: `meta` (action, entity ID, timestamp, user), `data` (the deal after the change) and `previous` (the changed fields' prior values), with custom field hashes replaced by their display names. Compare `data` with `previous` to see what changed; use **Get Deal** for the full record. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Webhooks#addWebhook)",
  version: "0.1.15",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getExtraData() {
      return {
        event_action: "change",
        event_object: "deal",
      };
    },
    getSummary(body) {
      return `Deal successfully updated: ${body.data.id}`;
    },
    async parseData(body) {
      return await parseData({
        fn: this.pipedrive.getDealCustomFields,
        body,
      });
    },
  },
  sampleEmit,
};
