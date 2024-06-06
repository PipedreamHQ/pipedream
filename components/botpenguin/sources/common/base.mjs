import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import botpenguin from "../../botpenguin.app.mjs";

export default {
  props: {
    botpenguin,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    getWebhookProps() {
      return {};
    },
    _getLastDate() {
      return this.db.get("lastDate") || "1970-01-01T00:00:01Z";
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();
      const response = this.botpenguin.paginate({
        fn: this.botpenguin.listContacts,
        maxResults,
        data: {
          createdAt: {
            startAt: lastDate,
            endsAt: "",
          },
          isContact: this.isContact(),
        },
      });

      let responseArray = [];

      for await (const item of response) {
        if (item.createdAt <= lastDate) break;
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastDate(responseArray[0].createdAt);

      for (const item of responseArray.reverse()) {
        this.$emit(item, this.generateMeta(item));
      }
    },
    generateMeta(data) {
      return {
        id: this.getId(data),
        summary: this.getSummary(data),
        ts: data.createdAt,
      };
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
};
