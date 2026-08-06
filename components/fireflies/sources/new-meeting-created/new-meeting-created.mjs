// x-pd-ai: optimized
import fireflies from "../../fireflies.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import constants from "../../common/constants.mjs";
import queries from "../../common/queries.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "fireflies-new-meeting-created",
  name: "New Meeting Created",
  description: "Emit new event when a meeting has finished transcribing, with the full transcript (summary, sentence-level text, duration, audio/video URLs) in the event payload. Polls on a timer rather than using webhooks, so a meeting appears only once Fireflies has finished processing it — not the moment the call ends. [See the documentation](https://docs.fireflies.ai/graphql-api/query/transcripts)",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  props: {
    fireflies,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || this.oneDayAgo();
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    oneDayAgo() {
      return Date.now() - 24 * 60 * 60 * 1000;
    },
    emitEvent(result) {
      const meta = this.generateMeta(result);
      this.$emit(result, meta);
    },
    generateMeta(result) {
      return {
        id: result.id,
        summary: `New Meeting: ${result.title}`,
        ts: result.date,
      };
    },
  },
  hooks: {
    async deploy() {
      const lastDate = this.oneDayAgo();
      this._setLastDate(lastDate);
    },
  },
  async run() {
    const lastDate = this._getLastDate();
    const limit = constants.DEFAULT_LIMIT;
    const variables = {
      // plus 15 minutes to the last date
      fromDate: new Date(lastDate - 15 * 60 * 1000).toISOString(),
      limit,
      skip: 0,
    };
    let total;
    const results = [];

    do {
      const { data: { transcripts } } = await this.fireflies.query({
        data: {
          query: queries.listTranscriptsByDate,
          variables,
        },
      });
      results.push(...transcripts);
      total = transcripts?.length;
      variables.skip += limit;
    } while (total === limit);

    if (!results.length) {
      return;
    }

    this._setLastDate(results[0].date);
    results.reverse().forEach((result) => this.emitEvent(result));
  },
  sampleEmit,
};
