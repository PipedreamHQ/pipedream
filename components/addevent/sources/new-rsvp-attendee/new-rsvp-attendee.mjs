import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "addevent-new-rsvp-attendee",
  name: "New RSVP Attendee",
  description: "Emit new event when a new attendee RSVPs to your event",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventId: {
      propDefinition: [
        common.props.addevent,
        "eventId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getTsField() {
      return "created";
    },
    getResourceFn() {
      return this.addevent.listRsvps;
    },
    getParams() {
      return {
        event_ids: this.eventId,
        sort_by: "created",
        sort_order: "desc",
      };
    },
    getResourceType() {
      return "rsvps";
    },
    generateMeta(rsvp) {
      return {
        id: rsvp.id,
        summary: `New rsvp: ${rsvp.email}`,
        ts: Date.parse(rsvp.created),
      };
    },
  },
  sampleEmit,
};
