import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../goto_meeting.app.mjs";

export default {
  key: "goto_meeting-new-meeting",
  name: "New Meeting Created",
  description: "Emit new event when a meeting is created in your GoToMeeting account.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    async emitEvent() {
      const response = await this.app.listUpcomingMeetings();

      for (const item of response) {
        this.$emit(item, {
          id: item.meetingId,
          summary: `Meeting Created: ${item.meetingId}`,
          ts: Date.now(),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvent();
    },
  },
  async run() {
    await this.emitEvent();
  },
};
