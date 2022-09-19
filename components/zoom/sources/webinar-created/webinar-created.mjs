import common from "../common/common.mjs";

export default {
  ...common,
  key: "zoom-webinar-created",
  name: "Webinar Created (Instant)",
  description: "Emit new event each time a webinar is created where you're the host",
  version: "0.0.4",
  type: "source",
  dedupe: "unique", // Dedupe based on webinar ID
  props: {
    ...common.props,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames: [
        "webinar.created.by_me",
        "webinar.created.for_me",
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
        }, object);
      }
    },
  },
  methods: {
    ...common.methods,
    emitEvent(payload, object) {
      const meta = this.generateMeta(object);
      this.$emit({
        event: "webinar.created",
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
