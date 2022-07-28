import common from "../common/common.mjs";

export default {
  ...common,
  key: "zoom-webinar-ended",
  name: "Webinar Ended (Instant)",
  description: "Emit new event each time a webinar ends where you're the host",
  version: "0.0.4",
  type: "source",
  dedupe: "unique", // Dedupe based on webinar ID
  props: {
    ...common.props,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames: [
        "webinar.ended",
      ],
    },
  },
  hooks: {
    async deploy() {
      const { webinars } = await this.zoom.listWebinarMetrics({
        from: this.monthAgo(),
        to: new Date().toISOString()
          .slice(0, 10),
        page_size: 25,
      });
      if (!webinars || webinars.length === 0) {
        return;
      }
      const objects = this.sortByDate(webinars, "end_time");
      for (const object of objects) {
        const endTime = Date.parse(object.end_time);
        if (endTime < Date.now()) {
          this.emitEvent({
            object,
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
        event: "webinar.ended",
        payload,
      }, meta);
    },
    generateMeta(object) {
      return {
        id: object.uuid,
        summary: object.topic,
        ts: +new Date(object.end_time),
      };
    },
  },
};
