import common from "../common/polling.mjs";
import events from "../common/events.mjs";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "opensrs-new-dns-zone-change",
  name: "New DNS Zone Change",
  description: "Emit new event when the DNS/ZONE check has passed or failed at the registry. [See the documentation](https://domains.opensrs.guide/docs/zone_check_status_change-domain).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isResourceRelevant(resource) {
      return resource.object === constants.OBJECT_TYPE.DOMAIN
        && resource.event === events.ZONE_CHECK_STATUS_CHANGE;
    },
    generateMeta(resource) {
      return {
        id: resource.event_id,
        summary: `New DNS Zone Change: ${resource.objectData.domain_name}`,
        ts: Date.parse(resource.event_date),
      };
    },
  },
  sampleEmit,
};
