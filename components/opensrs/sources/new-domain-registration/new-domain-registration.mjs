import common from "../common/polling.mjs";
import events from "../common/events.mjs";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "opensrs-new-domain-registration",
  name: "New Domain Registration",
  description: "Emit new event for each new domain registration. [See the documentation](https://domains.opensrs.guide/docs/registered-domain).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isResourceRelevant(resource) {
      return resource.object === constants.OBJECT_TYPE.DOMAIN
        && resource.event === events.REGISTERED;
    },
    generateMeta(resource) {
      return {
        id: resource.event_id,
        summary: `New domain: ${resource.objectData.domain_name}`,
        ts: Date.parse(resource.event_date),
      };
    },
  },
  sampleEmit,
};
