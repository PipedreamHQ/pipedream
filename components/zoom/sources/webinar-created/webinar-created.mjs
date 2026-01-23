import common from "../common/common.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "zoom-webinar-created",
  name: "Webinar Created (Instant)",
  description: "Emit new event each time a webinar is created where you're the host",
  version: "0.1.7",
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
          constants.CUSTOM_EVENT_TYPES.WEBINAR_CREATED_BY_ME,
          constants.CUSTOM_EVENT_TYPES.WEBINAR_CREATED_FOR_ME,
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
