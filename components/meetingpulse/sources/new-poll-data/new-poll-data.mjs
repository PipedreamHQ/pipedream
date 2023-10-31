import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import meetingpulse from "../../meetingpulse.app.mjs";

export default {
  key: "meetingpulse-new-poll-data",
  name: "New Poll Data",
  description: "Emit new event every time the results of a poll change. [See the documentation]()",
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
  },
  methods: {
    _getPreviousPollResults() {
      return this.db.get("pollResults") || [];
    },
    _setPreviousPollResults(pollResults) {
      this.db.set("pollResults", pollResults);
    },
  },
  async run() {
    const pollResults = await this.meetingpulse.getPollResults({
      meetingId: this.meetingId,
    });
    const previousPollResults = this._getPreviousPollResults();

    for (const result of pollResults) {
      // eslint-disable-next-line max-len
      if (!previousPollResults.find((prev) => prev.id === result.id && prev.voteCount === result.voteCount)) {
        this.$emit(result, {
          id: result.id,
          summary: `New results for poll: ${result.title}`,
          ts: Date.now(),
        });
      }
    }

    this._setPreviousPollResults(pollResults);
  },
};
