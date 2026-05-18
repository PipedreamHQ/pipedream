import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zendesk-new-side-conversation",
  name: "New Side Conversation",
  type: "source",
  description: "Emit new event when a side conversation is created on a ticket. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/side_conversation/side_conversation/)",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isRelevant(event) {
      return event.type === "create";
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: event.message?.subject || `New side conversation ${event.side_conversation_id}`,
        ts: Date.parse(event.created_at),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    if (!lastTs) {
      this._setLastTs(Math.floor(Date.now() / 1000));
      return;
    }
    let nextPageUrl = null;
    let endTime = lastTs;
    while (true) {
      const {
        events = [],
        end_time: et,
        next_page: nextPage,
      } = await this.zendesk.listSideConversationEvents(
        nextPageUrl
          ? {
            nextPageUrl,
          }
          : {
            startTime: lastTs,
          },
      );
      for (const event of events) {
        if (this.isRelevant(event)) {
          this.$emit(event, this.generateMeta(event));
        }
      }
      endTime = et || endTime;
      if (!nextPage) {
        break;
      }
      nextPageUrl = nextPage;
    }
    this._setLastTs(endTime);
  },
  sampleEmit,
};
