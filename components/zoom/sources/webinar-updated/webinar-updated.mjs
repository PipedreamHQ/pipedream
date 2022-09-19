import common from "../common/common.mjs";

export default {
  ...common,
  key: "zoom-webinar-updated",
  name: "Webinar Updated (Instant)",
  description: "Emit new event each time a webinar is updated where you're the host",
  version: "0.0.4",
  type: "source",
  dedupe: "unique", // Dedupe based on webinar ID & timestamp
  props: {
    ...common.props,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames: [
        "webinar.updated",
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
      const objects = this.sortByDate(webinars, "created_at");
      for (const object of objects) {
        this.emitEvent({
          object,
          time_stamp: +new Date(object.start_time),
        }, object);
      }
    },
  },
  methods: {
    ...common.methods,
    emitEvent(payload, object) {
      const meta = this.generateMeta(payload, object);
      this.$emit({
        event: "webinar.updated",
        payload,
      }, meta);
    },
    generateMeta(payload, object) {
      return {
        id: `${object.id}-${payload.time_stamp}`,
        summary: `Webinar ${object.id} updated`,
        ts: +new Date(object.start_time),
      };
    },
  },
};
