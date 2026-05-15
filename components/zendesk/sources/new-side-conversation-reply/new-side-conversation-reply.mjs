import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zendesk-new-side-conversation-reply",
  name: "New Side Conversation Reply",
  type: "source",
  description: "Emit new event when a reply is added to an existing side conversation on a ticket. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/side_conversation/side_conversation_event/)",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isRelevant(event) {
      return event.type === "reply";
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: event.message?.subject || `Side conversation reply ${event.side_conversation_id}`,
        ts: Date.parse(event.created_at),
      };
    },
  },
  async run() {
    let lastTs = this._getLastTs();
    if (!lastTs) {
      this._setLastTs(Math.floor(Date.now() / 1000));
      return;
    }
    while (true) {
      const {
        events = [],
        end_time: endTime,
        next_page: nextPage,
      } = await this.zendesk.listSideConversationEvents({
        startTime: lastTs,
      });
      for (const event of events) {
        if (this.isRelevant(event)) {
          this.$emit(event, this.generateMeta(event));
        }
      }
      lastTs = endTime || lastTs;
      if (!nextPage || !endTime) {
        break;
      }
    }
    this._setLastTs(lastTs);
  },
  sampleEmit,
};
