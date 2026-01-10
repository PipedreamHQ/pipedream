import common from "../common/common.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "zoom-meeting-deleted",
  name: "Meeting Deleted (Instant)",
  description: "Emit new event each time a meeting is deleted where you're the host",
  version: "0.1.5",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    apphook: {
      type: "$.interface.apphook",
      appProp: "app",
      eventNames() {
        return [
          constants.CUSTOM_EVENT_TYPES.MEETING_DELETED_BY_ME,
          constants.CUSTOM_EVENT_TYPES.MEETING_DELETED_FOR_ME,
        ];
      },
    },
  },
  methods: {
    ...common.methods,
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
