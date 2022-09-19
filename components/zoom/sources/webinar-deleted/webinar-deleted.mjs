import common from "../common/common.mjs";

export default {
  ...common,
  key: "zoom-webinar-deleted",
  name: "Webinar Deleted",
  description: "Emit new event each time a webinar is deleted where you're the host",
  version: "0.0.4",
  type: "source",
  dedupe: "unique", // Dedupe based on webinar ID
  props: {
    ...common.props,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames: [
        "webinar.deleted.by_me",
        "webinar.deleted.for_me",
      ],
    },
  },
  methods: {
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
