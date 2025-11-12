import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "addevent-new-calendar-subscriber",
  name: "New Calendar Subscriber",
  description: "Emit new event when a new subscriber is added to a calendar.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    calendarId: {
      propDefinition: [
        common.props.addevent,
        "calendarId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getTsField() {
      return "created";
    },
    getResourceFn() {
      return this.addevent.listSubscribers;
    },
    getParams() {
      return {
        calendar_ids: this.calendarId,
        sort_by: "created",
        sort_order: "desc",
      };
    },
    getResourceType() {
      return "subscribers";
    },
    generateMeta(subscriber) {
      return {
        id: subscriber.id,
        summary: `New subscriber: ${subscriber.id}`,
        ts: Date.parse(subscriber.created),
      };
    },
  },
  sampleEmit,
};
