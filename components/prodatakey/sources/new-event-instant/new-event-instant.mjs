import { EVENT_OPTIONS } from "../../common/constants.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "prodatakey-new-event-instant",
  name: "New Event (Instant)",
  description: "Emit new event when an event is triggered. [See the documentation](https://developer.pdk.io/web/2.0/rest/webhooks/#introduction)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    event: {
      type: "string",
      label: "Event",
      description: "The event to listen for",
      options: EVENT_OPTIONS,
    },
  },
  methods: {
    getEvent() {
      return [
        this.event,
      ];
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `Event triggered for ${event.cloudNodeSN}`,
        ts: event.occurred.occurred || Date.now(),
      };
    },
  },
  sampleEmit,
};
