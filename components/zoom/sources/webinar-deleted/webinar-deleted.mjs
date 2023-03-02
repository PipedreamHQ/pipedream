import common from "../common/common.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "zoom-webinar-deleted",
  name: "Webinar Deleted (Instant)",
  description: "Emit new event each time a webinar is deleted where you're the host",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventNames() {
      return [
        constants.CUSTOM_EVENT_TYPES.WEBINAR_DELETED_BY_ME,
        constants.CUSTOM_EVENT_TYPES.WEBINAR_DELETED_FOR_ME,
      ];
    },
    emitEvent(payload, object) {
      const meta = this.generateMeta(object);
      this.$emit({
        event: "webinar.deleted",
        payload,
      }, meta);
    },
    generateMeta(object) {
      return {
        id: object.uuid,
        summary: object.topic,
        ts: +new Date(object.start_time),
      };
    },
  },
};
