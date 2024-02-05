import asyncInterview from "../../async_interview.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "async_interview-new-interview-response",
  name: "New Interview Response",
  description: "Emit new event when a new interview response is received.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    asyncInterview: {
      type: "app",
      app: "async_interview",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    interviewId: asyncInterview.propDefinitions.interviewId,
    candidateEmail: {
      ...asyncInterview.propDefinitions.candidateEmail,
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // Emit events for existing interview responses during the first run
      const interviewResponses = await this.asyncInterview.emitNewInterviewResponse(this.interviewId, this.candidateEmail);
      for (const response of interviewResponses) {
        this.$emit(response, {
          id: response.id,
          summary: `New Interview Response: ${response.id}`,
          ts: Date.parse(response.created_at),
        });
      }
    },
  },
  async run() {
    // Emit new interview responses
    const lastEmittedTimestamp = this.db.get("lastEmittedTimestamp") || 0;
    const newResponses = await this.asyncInterview.emitNewInterviewResponse(this.interviewId, this.candidateEmail);
    const filteredResponses = newResponses.filter((response) => Date.parse(response.created_at) > lastEmittedTimestamp);

    for (const response of filteredResponses) {
      this.$emit(response, {
        id: response.id,
        summary: `New Interview Response: ${response.id}`,
        ts: Date.parse(response.created_at),
      });
    }

    if (filteredResponses.length > 0) {
      const latestTimestamp = Math.max(...filteredResponses.map((response) => Date.parse(response.created_at)));
      this.db.set("lastEmittedTimestamp", latestTimestamp);
    }
  },
};
