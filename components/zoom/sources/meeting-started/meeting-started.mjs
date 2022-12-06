import common from "../common/common.mjs";

export default {
  ...common,
  key: "zoom-meeting-started",
  name: "Meeting Started (Instant)",
  description: "Emit new event each time a meeting starts where you're the host",
  version: "0.0.4",
  type: "source",
  dedupe: "unique", // Dedupe based on meeting ID
  props: {
    ...common.props,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames: [
        "meeting.started",
      ],
    },
  },
  hooks: {
    async deploy() {
      const { meetings } = await this.zoom.listMeetings({
        page_size: 25,
        type: "previous_meetings",
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
        event: "meeting.started",
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
