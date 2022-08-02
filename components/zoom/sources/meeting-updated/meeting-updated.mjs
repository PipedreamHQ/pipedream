import common from "../common/common.mjs";

export default {
  ...common,
  key: "zoom-meeting-updated",
  name: "Meeting Updated (Instant)",
  description: "Emit new event each time a meeting is updated where you're the host",
  version: "0.0.4",
  type: "source",
  dedupe: "unique", // dedupe on the meeting ID + timestamp
  props: {
    ...common.props,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames: [
        "meeting.updated",
      ],
    },
  },
  hooks: {
    async deploy() {
      const { meetings } = await this.zoom.listMeetings({
        page_size: 25,
      });
      if (!meetings || meetings.length === 0) {
        return;
      }
      const objects = this.sortByDate(meetings, "created_at");
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
        event: "meeting.updated",
        payload,
      }, meta);
    },
    generateMeta(payload, object) {
      return {
        id: `${object.id}-${payload.time_stamp}`,
        summary: `Meeting ${object.id} updated`,
        ts: +new Date(object.start_time),
      };
    },
  },
};
