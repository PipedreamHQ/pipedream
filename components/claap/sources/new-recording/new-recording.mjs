import claap from "../../claap.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "claap-new-recording",
  name: "New Recording",
  description: "Emit new event when a new recording is created in Claap. [See the documentation](https://docs.claap.io/api-reference/endpoint/list_recordings).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    claap,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    channelId: {
      propDefinition: [
        claap,
        "channelId",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.processRecordings(25);
    },
  },
  methods: {
    _getLastCreatedAt() {
      return this.db.get("lastCreatedAt") || 0;
    },
    _setLastCreatedAt(value) {
      this.db.set("lastCreatedAt", value);
    },
    generateMeta(recording) {
      return {
        id: recording.id,
        summary: recording.title || recording.id,
        ts: Date.parse(recording.createdAt),
      };
    },
    async processRecordings(maxResults) {
      const lastCreatedAt = this._getLastCreatedAt();
      const params = {
        sort: "created_desc",
        channelId: this.channelId,
      };
      if (lastCreatedAt) {
        params.createdAfter = new Date(lastCreatedAt).toISOString();
      }

      const recordings = [];
      let cursor;
      do {
        const { result = {} } = await this.claap.listRecordings({
          params: {
            ...params,
            cursor,
            limit: maxResults
              ? Math.min(100, maxResults - recordings.length)
              : 100,
          },
        });
        const page = result.recordings || [];
        recordings.push(...page);
        cursor = result.pagination?.nextCursor;
      } while (cursor && (!maxResults || recordings.length < maxResults));

      if (!recordings.length) {
        return;
      }
      let maxTs = lastCreatedAt;
      for (const recording of recordings.reverse()) {
        const ts = Date.parse(recording.createdAt);
        if (ts > maxTs) {
          maxTs = ts;
        }
        this.$emit(recording, this.generateMeta(recording));
      }
      this._setLastCreatedAt(maxTs);
    },
  },
  async run() {
    await this.processRecordings();
  },
};
