import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import belco from "../../belco.app.mjs";

export default {
  key: "belco-new-conversation",
  name: "New Conversation",
  description: "Emit new conversation event when a new conversation is created. [See the documentation](https://developers.belco.io/reference/get_conversations)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    belco,
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
      return this.db.get("lastDate") || "1970-01-01T00:00:00.000Z";
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();

      const response = this.belco.paginate({
        fn: this.belco.listConversations,
      });

      let responseArray = [];
      for await (const conversation of response) {
        responseArray.push(conversation);
      }

      responseArray = responseArray
        .filter((conversation) => (conversation.createdAt > lastDate))
        .filter((conversation) => (conversation.channel))
        .sort((a, b) => (a.createdAt - b.createdAt));
      console.log("responseArray: ", responseArray);

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastDate(responseArray[0].createdAt);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item._id,
          summary: `New conversation: ${item.subject || item._id}`,
          ts: Date.parse(item.createdAt),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvent(25);
    },
  },
  async run() {
    await this.emitEvent();
  },
};
