import common from "../common/common.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "zoom-meeting-started",
  name: "Meeting Started (Instant)",
  description: "Emit new event each time a meeting starts where you're the host",
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
          constants.CUSTOM_EVENT_TYPES.MEETING_STARTED,
        ];
      },
    },
  },
  hooks: {
    async deploy() {
      const { meetings } = await this.app.listMeetings({
        params: {
          page_size: 25,
          type: "previous_meetings",
        },
      });
      if (!meetings || meetings.length === 0) {
        return;
      }
      const objects = this.sortByDate(meetings, "start_time");
      for (const object of objects) {
        const startTime = Date.parse(object.start_time);
        if (startTime < Date.now()) {
          this.emitEvent({
            object,
            time_stamp: Date.now(),
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
        event: constants.CUSTOM_EVENT_TYPES.MEETING_STARTED,
        payload,
      }, meta);
    },
    generateMeta(object) {
      return {
        id: object.uuid,
        summary: `Meeting ${object.topic} started`,
        ts: +new Date(object.start_time),
      };
    },
  },
};
