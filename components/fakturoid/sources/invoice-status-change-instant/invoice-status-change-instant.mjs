import constants from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "fakturoid-invoice-status-change-instant",
  name: "New Fakturoid Invoice Status Change (Instant)",
  description: "Emit new event when an invoice status changes.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    events: {
      type: "string[]",
      label: "Events",
      description: "List of events when webhook is fired",
      options: constants.EVENT_OPTIONS,
    },
  },
  methods: {
    ...common.methods,
    getEvents() {
      return parseObject(this.events);
    },
    getSummary({
      eventName, body,
    }) {
      return  `Invoice ${body.id} status changed to ${eventName}`;
    },
  },
  sampleEmit,
};
