import common from "../common/common.mjs";

export default {
  ...common,
  key: "zoom-webinar-started",
  name: "Webinar Started (Instant)",
  description: "Emit new event each time a webinar starts where you're the host",
  version: "0.0.4",
  type: "source",
  dedupe: "unique", // Dedupe based on webinar ID
  props: {
    ...common.props,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames: [
        "webinar.started",
      ],
    },
  },
  hooks: {
    async deploy() {
      const { webinars } = await this.zoom.listWebinars({
        page_size: 25,
      });
      if (!webinars || webinars.length === 0) {
        return;
      }
      const objects = this.sortByDate(webinars, "start_time");
      for (const object of objects) {
        const startTime = Date.parse(object.start_time);
        if (startTime < Date.now()) {
          this.emitEvent({
            object,
            time_stamp: startTime,
          }, object);
        }
      }
    },
  },
  methods: {
    ...common.methods,
    emitEvent(payload, object) {
      const meta = this.generateMeta(object);
      this.$emit({
        event: "webinar.started",
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
