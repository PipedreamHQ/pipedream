import common from "../common/common.mjs";
import {
  DEFAULT_LIMIT, MAX_INITIAL_EVENTS,
} from "../../common/constants.mjs";

export default {
  ...common,
  key: "hubspot-new-message-in-thread",
  name: "New Message in Thread",
  description: "Emit new event when a new message is added to a thread. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-message/get-conversations-v3-conversations-threads-threadId-messages)",
  version: "0.0.8",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    threadId: {
      propDefinition: [
        common.props.hubspot,
        "threadId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getTs(message) {
      return Date.parse(message.createdAt);
    },
    // The messages endpoint only returns results oldest-first and has no
    // server-side timestamp filter, so we page through the whole thread and
    // filter by timestamp client-side. A single thread is bounded, so reaching
    // the newest (last) page is cheap.
    async fetchMessages() {
      const messages = [];
      const params = {
        limit: DEFAULT_LIMIT,
      };
      do {
        const {
          results = [], paging,
        } = await this.hubspot.listMessages({
          threadId: this.threadId,
          params,
        });
        messages.push(...results);
        params.after = paging?.next?.after;
      } while (params.after);
      return messages;
    },
    generateMeta(message) {
      return {
        id: message.id,
        summary: `New Message: ${message.id}`,
        ts: this.getTs(message),
      };
    },
  },
  hooks: {
    async deploy() {
      // Emit the most recent messages as a sample (messages are oldest-first,
      // so take the tail), then start the cursor at deploy time so run() only
      // emits genuinely new messages.
      const deployTs = Date.now();
      const messages = await this.fetchMessages();
      for (const message of messages.slice(-MAX_INITIAL_EVENTS)) {
        this.emitEvent(message);
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

    const messages = await this.fetchMessages();
    let newest = after;
    for (const message of messages) {
      const ts = this.getTs(message);
      if (ts > after) {
        this.emitEvent(message);
      }
      if (ts > newest) {
        newest = ts;
      }
    }
    // Advance only to the newest message actually observed. When nothing new
    // came back, `newest` still equals `after`, so the cursor stays put rather
    // than jumping to wall-clock time — otherwise a message created mid-fetch
    // (timestamped before the cursor write but returned after it) would be
    // skipped permanently.
    this._setAfter(newest);
  },
};
