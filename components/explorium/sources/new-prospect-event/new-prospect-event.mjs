import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "explorium-new-prospect-event",
  name: "New Prospect Event (Instant)",
  description: "Emit new event when a prospect update occurs. [See the documentation](https://developers.explorium.ai/reference/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "The types of events to enroll in",
      options: constants.PROSPECT_EVENT_TYPES,
    },
    prospectIds: {
      type: "string[]",
      label: "Prospect IDs",
      description: "The IDs of the prospects to enroll in the event",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    generateMeta(body) {
      return {
        id: body.event_id,
        summary: `New ${body.event_type} event for prospect ${body.entity_id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
