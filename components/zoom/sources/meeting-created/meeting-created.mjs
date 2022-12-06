import common from "../common/common.mjs";

export default {
  ...common,
  key: "zoom-meeting-created",
  name: "Meeting Created (Instant)",
  description: "Emit new event each time a meeting is created where you're the host",
  version: "0.0.4",
  type: "source",
  dedupe: "unique", // Dedupe based on meeting ID
  props: {
    ...common.props,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames: [
        "meeting.created.by_me",
        "meeting.created.for_me",
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
        }, object);
      }
    },
  },
  methods: {
    ...common.methods,
    emitEvent(payload, object) {
      const meta = this.generateMeta(object);
      this.$emit({
        event: "meeting.created",
        payload,
      }, meta);
    },
    generateMeta(object) {
      return {
        id: object.uuid,
        summary: `Meeting ${object.topic} created`,
        ts: +new Date(object.start_time),
      };
    },
  },
};
