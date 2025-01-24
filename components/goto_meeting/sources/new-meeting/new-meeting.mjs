import goto_meeting from "../../goto_meeting.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "goto_meeting-new-meeting",
  name: "New Meeting Created",
  description: "Emit a new event when a meeting is created in your GoToMeeting account. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    goto_meeting: {
      type: "app",
      app: "goto_meeting",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const MAX_EVENTS = 50;
      let page = 1;
      const fetchedMeetings = [];

      while (fetchedMeetings.length < MAX_EVENTS) {
        const meetings = await this.goto_meeting._makeRequest({
          method: "GET",
          path: "/meetings",
          params: {
            page,
            perPage: 50,
            orderBy: "created",
            order: "desc",
          },
        });

        if (meetings.length === 0) {
          break;
        }

        fetchedMeetings.push(...meetings);

        if (meetings.length < 50) {
          break;
        }

        page += 1;
      }

      const recentMeetings = fetchedMeetings.slice(0, MAX_EVENTS).reverse();

      for (const meeting of recentMeetings) {
        this.$emit(meeting, {
          id: meeting.id || meeting.created,
          summary: `Meeting Created: ${meeting.subject}`,
          ts: meeting.created
            ? Date.parse(meeting.created)
            : Date.now(),
        });
      }

      const lastMeeting = fetchedMeetings[0];
      const lastTimestamp = lastMeeting.created
        ? Date.parse(lastMeeting.created)
        : Date.now();
      await this.db.set("lastTimestamp", lastTimestamp);
    },
    async activate() {
      // Add activation logic if needed
    },
    async deactivate() {
      // Add deactivation logic if needed
    },
  },
  async run() {
    const lastTimestamp = (await this.db.get("lastTimestamp")) || 0;
    let page = 1;
    const newMeetings = [];

    while (true) {
      const meetings = await this.goto_meeting._makeRequest({
        method: "GET",
        path: "/meetings",
        params: {
          page,
          perPage: 50,
          orderBy: "created",
          order: "desc",
        },
      });

      if (meetings.length === 0) {
        break;
      }

      for (const meeting of meetings) {
        const meetingTimestamp = meeting.created
          ? Date.parse(meeting.created)
          : Date.now();
        if (meetingTimestamp > lastTimestamp) {
          newMeetings.push(meeting);
        } else {
          break;
        }
      }

      if (meetings.length < 50) {
        break;
      }

      page += 1;
    }

    if (newMeetings.length > 0) {
      for (const meeting of newMeetings.reverse()) {
        this.$emit(meeting, {
          id: meeting.id || meeting.created,
          summary: `Meeting Created: ${meeting.subject}`,
          ts: meeting.created
            ? Date.parse(meeting.created)
            : Date.now(),
        });
      }

      const latestMeeting = newMeetings[0];
      const latestTimestamp = latestMeeting.created
        ? Date.parse(latestMeeting.created)
        : Date.now();
      await this.db.set("lastTimestamp", latestTimestamp);
    }
  },
};
