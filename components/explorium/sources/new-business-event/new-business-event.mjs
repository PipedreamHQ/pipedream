import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "explorium-new-business-event",
  name: "New Business Event (Instant)",
  description: "Emit new event when a business update occurs. [See the documentation](https://developers.explorium.ai/reference/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "The types of events to enroll in",
      options: constants.BUSINESS_EVENT_TYPES,
    },
    businessIds: {
      type: "string[]",
      label: "Business IDs",
      description: "The IDs of the businesses to enroll in the event",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    generateMeta(body) {
      return {
        id: body.event_id,
        summary: `New ${body.event_type} event for business ${body.entity_id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
