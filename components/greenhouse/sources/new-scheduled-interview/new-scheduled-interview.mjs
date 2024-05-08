import { axios } from "@pipedream/platform";
import greenhouse from "../../greenhouse.app.mjs";

export default {
  key: "greenhouse-new-scheduled-interview",
  name: "New Scheduled Interview",
  description: "Emit new event when a new interview is scheduled within a specific time period.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    greenhouse,
    db: "$.service.db",
    scheduleDetail: {
      propDefinition: [
        greenhouse,
        "scheduleDetail",
      ],
    },
    timePeriod: {
      propDefinition: [
        greenhouse,
        "timePeriod",
      ],
    },
  },
  methods: {
    ...greenhouse.methods,
  },
  hooks: {
    async deploy() {
      // Fetch historical data and emit events for them
      const lastCheckedTime = this.db.get("lastCheckedTime") || new Date().toISOString();
      const currentTime = new Date().toISOString();

      const interviews = await this.greenhouse.getScheduledInterviews({
        startTime: lastCheckedTime,
        endTime: currentTime,
      });

      interviews.forEach((interview) => {
        this.$emit(interview, {
          id: interview.id,
          summary: `New Interview Scheduled: ${interview.candidateName}`,
          ts: Date.parse(interview.scheduledTime),
        });
      });

      this.db.set("lastCheckedTime", currentTime);
    },
  },
  async run() {
    const lastCheckedTime = this.db.get("lastCheckedTime") || new Date().toISOString();
    const currentTime = new Date().toISOString();

    const interviews = await this.greenhouse.getScheduledInterviews({
      startTime: lastCheckedTime,
      endTime: currentTime,
    });

    interviews.forEach((interview) => {
      this.$emit(interview, {
        id: interview.id,
        summary: `New Interview Scheduled: ${interview.candidateName}`,
        ts: Date.parse(interview.scheduledTime),
      });
    });

    this.db.set("lastCheckedTime", currentTime);
  },
};
