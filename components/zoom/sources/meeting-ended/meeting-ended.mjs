import common from "../common/common.mjs";

export default {
  ...common,
  key: "zoom-meeting-ended",
  name: "Meeting Ended (Instant)",
  description: "Emit new event each time a meeting ends where you're the host",
  version: "0.0.4",
  type: "source",
  dedupe: "unique", // Dedupe based on meeting ID
  props: {
    ...common.props,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames: [
        "meeting.ended",
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
      const detailedMeetings = [];
      for (const meeting of meetings) {
        try {
          const details = await this.zoom.getPastMeetingDetails(meeting.id);
          detailedMeetings.push(details);
        } catch {
          // catch error thrown by getPastMeetingDetails if meeting has not ended
          continue;
        }
      }
      const objects = this.sortByDate(detailedMeetings, "end_time");
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
        event: "meeting.ended",
        payload,
      }, meta);
    },
    generateMeta(object) {
      return {
        id: object.uuid,
        summary: `Meeting ${object.topic} ended`,
        ts: +new Date(object.end_time),
      };
    },
  },
};
