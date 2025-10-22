import { DEFAULT_LIMIT } from "../../common/constants.mjs";
import { EMAIL_EVENT_TYPES } from "../../common/object-types.mjs";
import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-email-event",
  name: "New Email Event",
  description: "Emit new event for each new Hubspot email event.",
  version: "0.0.39",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    type: {
      type: "string",
      label: "Event Type",
      description: "Filter results by the email event type",
      options: EMAIL_EVENT_TYPES,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getTs(emailEvent) {
      return Date.parse(emailEvent.created);
    },
    generateMeta(emailEvent) {
      const {
        id, recipient, type,
      } = emailEvent;
      const ts = this.getTs(emailEvent);
      return {
        id,
        summary: `${recipient} - ${type}`,
        ts,
      };
    },
    getParams(after) {
      const params = {
        limit: DEFAULT_LIMIT,
        startTimestamp: after,
      };
      if (this.type) {
        params.eventType = this.type;
      }
      return {
        params,
      };
    },
    async processResults(after, params) {
      await this.paginateUsingHasMore(
        params,
        this.hubspot.getEmailEvents.bind(this),
        "events",
      );
    },
  },
  sampleEmit,
};
