import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import meetingpulse from "../../meetingpulse.app.mjs";

export default {
  key: "meetingpulse-new-poll-data",
  name: "New Poll Data",
  description: "Emit new event every time the results of a poll change. [See the documentation](https://app.meet.ps/api/docs/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    meetingpulse,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    meetingId: {
      propDefinition: [
        meetingpulse,
        "meetingId",
      ],
    },
    pollId: {
      propDefinition: [
        meetingpulse,
        "pollId",
        ({ meetingId }) => ({
          meetingId,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessData();
    },
  },
  methods: {
    _getPreviousPollResults() {
      return this.db.get("pollResults") || {};
    },
    _setPreviousPollResults(value) {
      this.db.set("pollResults", value);
    },
    async getAndProcessData() {
      const poll = await this.meetingpulse.getPoll({
        meetingId: this.meetingId,
        pollId: this.pollId,
      });

      const previousPollResults = this._getPreviousPollResults();
      const results = JSON.stringify(poll.results);

      if (results !== previousPollResults) {
        const ts = Date.now();
        this.$emit(poll, {
          id: ts,
          summary: `Poll updated: ${poll.question}`,
          ts,
        });
        this._setPreviousPollResults(results);
      }
    },
  },
  async run() {
    await this.getAndProcessData();
  },
};
