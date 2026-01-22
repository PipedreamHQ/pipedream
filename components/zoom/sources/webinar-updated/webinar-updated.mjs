import common from "../common/common.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "zoom-webinar-updated",
  name: "Webinar Updated (Instant)",
  description: "Emit new event each time a webinar is updated where you're the host",
  version: "0.1.6",
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
          constants.CUSTOM_EVENT_TYPES.WEBINAR_UPDATED,
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
        event: constants.CUSTOM_EVENT_TYPES.WEBINAR_UPDATED,
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
