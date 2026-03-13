import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import buildchatbot from "../../buildchatbot.app.mjs";

export default {
  props: {
    buildchatbot,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    chatbotId: {
      propDefinition: [
        buildchatbot,
        "chatbotId",
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const fn = this.getFunction();
      const { data: response } = await fn({
        params: {
          maxResults,
          bot_id: this.chatbotId,
        },
      });

      let responseArray = [];
      for (const item of response) {
        if (Date.parse(item.created_at) <= lastDate) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastDate(Date.parse(responseArray[0].created_at));
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.qa_id,
          summary: this.getSummary(item),
          ts: Date.parse(item.created_at),
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
