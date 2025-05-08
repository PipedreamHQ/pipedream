import common from "../common/common.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "zoom-webinar-started",
  name: "Webinar Started (Instant)",
  description: "Emit new event each time a webinar starts where you're the host",
  version: "0.1.4",
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
          constants.CUSTOM_EVENT_TYPES.WEBINAR_STARTED,
        ];
      },
    },
  },
  hooks: {
    async deploy() {
      const { webinars } = await this.app.listWebinars({
        params: {
          page_size: 25,
        },
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
        event: constants.CUSTOM_EVENT_TYPES.WEBINAR_STARTED,
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
