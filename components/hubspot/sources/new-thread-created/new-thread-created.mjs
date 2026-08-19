import common from "../common/common.mjs";
import {
  DEFAULT_LIMIT, MAX_INITIAL_EVENTS,
} from "../../common/constants.mjs";

export default {
  ...common,
  key: "hubspot-new-thread-created",
  name: "New Thread Created",
  description: "Emit new event when a new thread is created. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-thread/get-conversations-v3-conversations-threads)",
  version: "0.0.8",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTs(thread) {
      return Date.parse(thread.createdAt);
    },
    // The threads endpoint only ever returns results in ascending order and
    // won't honor a descending sort, so we cannot cheaply read the newest
    // threads. When a cursor is provided we sort by latestMessageTimestamp and
    // let the API filter server-side (latestMessageTimestampAfter), paging
    // through every thread with activity since the cursor. Without a cursor
    // (deploy sample) we only read the first page.
    async fetchThreads(latestMessageTimestampAfter = null) {
      const threads = [];
      const params = {
        limit: DEFAULT_LIMIT,
      };
      if (latestMessageTimestampAfter != null) {
        params.sort = "latestMessageTimestamp";
        params.latestMessageTimestampAfter = latestMessageTimestampAfter;
      }
      do {
        const {
          results = [], paging,
        } = await this.hubspot.listThreads({
          params,
        });
        threads.push(...results);
        params.after = paging?.next?.after;
        // The deploy sample only needs the first page.
        if (latestMessageTimestampAfter == null) {
          break;
        }
      } while (params.after);
      return threads;
    },
    generateMeta(thread) {
      return {
        id: thread.id,
        summary: `New Thread: ${thread.id}`,
        ts: this.getTs(thread),
      };
    },
  },
  hooks: {
    async deploy() {
      // Emit a small best-effort sample of existing threads, then start the
      // cursor at deploy time. The endpoint only returns threads oldest-first
      // with no cheap newest-first read, so the sample is oldest-first; that is
      // fine because run() is gated on deploy time and never re-emits these.
      const deployTs = Date.now();
      const threads = await this.fetchThreads();
      for (const thread of threads.slice(0, MAX_INITIAL_EVENTS)) {
        this.emitEvent(thread);
      }
      this._setAfter(deployTs);
    },
  },
  async run() {
    const after = this._getAfter();
    // Safety net: without a cursor, never emit retroactively; just start it.
    if (after == null) {
      this._setAfter(Date.now());
      return;
    }

    // Only threads with activity since the cursor are fetched (server-side); we
    // then emit those actually *created* after the cursor, so a pre-existing
    // thread that merely received a new message is not re-emitted as "new".
    const threads = await this.fetchThreads(after);
    let newest = after;
    for (const thread of threads) {
      const latest = Date.parse(thread.latestMessageTimestamp) || this.getTs(thread);
      if (this.getTs(thread) > after) {
        this.emitEvent(thread);
      }
      if (latest > newest) {
        newest = latest;
      }
    }
    // Advance only to the newest activity actually observed. When nothing new
    // came back, `newest` still equals `after`, so the cursor stays put rather
    // than jumping to wall-clock time — otherwise a thread created mid-fetch
    // (timestamped before the cursor write but returned after it) would be
    // skipped permanently.
    this._setAfter(newest);
  },
};
