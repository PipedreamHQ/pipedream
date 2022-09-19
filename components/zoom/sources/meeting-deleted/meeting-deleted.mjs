import common from "../common/common.mjs";

export default {
  ...common,
  key: "zoom-meeting-deleted",
  name: "Meeting Deleted (Instant)",
  description: "Emit new event each time a meeting is deleted where you're the host",
  version: "0.0.4",
  type: "source",
  dedupe: "unique", // Dedupe based on meeting ID
  props: {
    ...common.props,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames: [
        "meeting.deleted.by_me",
        "meeting.deleted.for_me",
      ],
    },
  },
  methods: {
    emitEvent(payload, object) {
      const meta = this.generateMeta(object);
      this.$emit({
        event: "meeting.deleted",
        payload,
      }, meta);
    },
    generateMeta(object) {
      return {
        id: object.uuid,
        summary: `Meeting ${object.topic} deleted`,
        ts: +new Date(object.start_time),
      };
    },
  },
};
