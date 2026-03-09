import common from "../common/common.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "zoom-meeting-ended",
  name: "Meeting Ended (Instant)",
  description: "Emit new event each time a meeting ends where you're the host",
  version: "0.1.8",
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
          constants.CUSTOM_EVENT_TYPES.MEETING_ENDED,
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
      const detailedMeetings = [];
      for (const meeting of meetings) {
        try {
          const details = await this.app.getPastMeetingDetails({
            meetingId: meeting.id,
          });
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
        event: constants.CUSTOM_EVENT_TYPES.MEETING_ENDED,
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
