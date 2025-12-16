import { EVENT_OPTIONS } from "../../common/constants.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "picqer-new-event-instant",
  name: "New Event Instant",
  description: "Emit new event when Picqer sends a webhook matched with selected event. [See the documentation](https://picqer.com/en/api/webhooks)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    getSummary(body) {
      const event = EVENT_OPTIONS.find((e) => e.value === body.event);
      return event.label;
    },
  },
  sampleEmit,
};
